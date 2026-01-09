import { embedText } from './embeddings'
import { queryVectors } from './vector-store'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

export interface SearchResult {
  slug: string
  title: string
  text: string
  score: number
  chunkIndex: number
}

export interface RelatedPost {
  slug: string
  title: string
  similarity: number
}

interface GraphData {
  nodes: Array<{
    id: string
    name: string
    tags: string[]
    date: string
    url: string
    group: string
  }>
  links: Array<{
    source: string
    target: string
    value: number
  }>
}

let graphData: GraphData | null = null

function loadGraphData(): GraphData | null {
  if (graphData) return graphData

  try {
    const graphPath = path.join(process.cwd(), 'public', 'graph', 'graph-data.json')
    if (fs.existsSync(graphPath)) {
      graphData = JSON.parse(fs.readFileSync(graphPath, 'utf-8'))
      return graphData
    }
  } catch (error) {
    console.warn('Failed to load graph data:', error)
  }
  return null
}

// slugから日付を抽出（YYYY-MM-DD形式）
function extractDateFromSlug(slug: string): Date | null {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/)
  if (match) {
    return new Date(match[1])
  }
  return null
}

// 最近系のクエリかどうかOpenAIで判定
async function isRecentQuery(query: string): Promise<{ isRecent: boolean; searchKeyword: string }> {
  const openai = new OpenAI()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `ユーザーの質問が「最近」「近況」「最新」など時間的に新しい情報を求めているかを判定してください。
JSONで回答してください:
- isRecent: 最近の情報を求めているならtrue
- searchKeyword: 「最近」などの時間表現を除いた検索キーワード（なければ空文字）

例:
「最近のマイブーム」→ {"isRecent": true, "searchKeyword": "マイブーム"}
「最近どうしてる？」→ {"isRecent": true, "searchKeyword": ""}
「マイブームは？」→ {"isRecent": false, "searchKeyword": "マイブーム"}
「VRChatについて」→ {"isRecent": false, "searchKeyword": "VRChat"}`
      },
      { role: 'user', content: query }
    ],
    temperature: 0,
    max_tokens: 100,
    response_format: { type: 'json_object' },
  })

  try {
    const result = JSON.parse(response.choices[0]?.message?.content || '{}')
    return {
      isRecent: result.isRecent === true,
      searchKeyword: result.searchKeyword || '',
    }
  } catch {
    return { isRecent: false, searchKeyword: query }
  }
}

export function getRelatedPosts(slug: string, limit: number = 3): RelatedPost[] {
  const graph = loadGraphData()
  if (!graph) return []

  const related: RelatedPost[] = []

  for (const link of graph.links) {
    if (link.source === slug || link.target === slug) {
      const targetSlug = link.source === slug ? link.target : link.source
      const node = graph.nodes.find(n => n.id === targetSlug)
      if (node) {
        related.push({
          slug: targetSlug,
          title: node.name,
          similarity: link.value,
        })
      }
    }
  }

  return related
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

// 最新の記事を取得
export function getRecentPosts(limit: number = 5): Array<{ slug: string; title: string; date: string }> {
  const graph = loadGraphData()
  if (!graph) return []

  return graph.nodes
    .filter(n => extractDateFromSlug(n.id) !== null)
    .sort((a, b) => {
      const dateA = extractDateFromSlug(a.id)
      const dateB = extractDateFromSlug(b.id)
      if (!dateA || !dateB) return 0
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
    .map(n => ({
      slug: n.id,
      title: n.name,
      date: n.date,
    }))
}

export async function searchPosts(
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  // OpenAIで「最近」系のクエリかどうか判定
  const { isRecent, searchKeyword } = await isRecentQuery(query)

  if (isRecent) {
    // 最新記事を取得
    const recentPosts = getRecentPosts(10)

    if (searchKeyword) {
      // キーワードがある場合はベクトル検索して日付順ソート
      const queryVector = await embedText(searchKeyword)
      const vectorResults = await queryVectors(queryVector, topK * 2)

      // 日付でソートして返す
      const resultsWithDate = vectorResults
        .map(r => ({
          slug: r.metadata.slug,
          title: r.metadata.title,
          text: r.metadata.text,
          score: r.score,
          chunkIndex: r.metadata.chunkIndex,
          date: extractDateFromSlug(r.metadata.slug),
        }))
        .filter(r => r.date !== null)
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
        .slice(0, topK)

      return resultsWithDate.map(({ date, ...rest }) => rest)
    } else {
      // 「最近どう？」のような質問は最新記事から
      const graph = loadGraphData()
      if (!graph) return []

      const results: SearchResult[] = []
      for (const post of recentPosts.slice(0, topK)) {
        const node = graph.nodes.find(n => n.id === post.slug)
        if (node) {
          results.push({
            slug: post.slug,
            title: post.title,
            text: `${post.title} (${post.date})`,
            score: 1,
            chunkIndex: 0,
          })
        }
      }
      return results
    }
  }

  // 通常のベクトル検索
  const queryVector = await embedText(query)
  const results = await queryVectors(queryVector, topK)

  return results.map(r => ({
    slug: r.metadata.slug,
    title: r.metadata.title,
    text: r.metadata.text,
    score: r.score,
    chunkIndex: r.metadata.chunkIndex,
  }))
}

export async function searchWithRelated(
  query: string,
  topK: number = 5
): Promise<{
  results: SearchResult[]
  relatedPosts: RelatedPost[]
}> {
  const results = await searchPosts(query, topK)

  // 検索結果のslugから重複を除去
  const uniqueSlugs = [...new Set(results.map(r => r.slug))]

  // 各結果の関連記事を取得
  const allRelated: RelatedPost[] = []
  for (const slug of uniqueSlugs) {
    const related = getRelatedPosts(slug, 2)
    allRelated.push(...related)
  }

  // 重複を除去し、検索結果に含まれるものを除外
  const seenSlugs = new Set(uniqueSlugs)
  const relatedPosts = allRelated
    .filter(r => {
      if (seenSlugs.has(r.slug)) return false
      seenSlugs.add(r.slug)
      return true
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)

  return { results, relatedPosts }
}
