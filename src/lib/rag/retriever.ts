import { embedText } from './embeddings'
import { queryVectors } from './vector-store'
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

// 「最近」系のキーワード
const RECENT_KEYWORDS = ['最近', '近況', '今', '最新', '直近', '近頃', 'この頃', '最近の']

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

// 最近系のクエリかどうか判定
function isRecentQuery(query: string): boolean {
  return RECENT_KEYWORDS.some(keyword => query.includes(keyword))
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

  // 「最近」系のクエリの場合、日付でソート
  if (isRecentQuery(query)) {
    // クエリから「最近」などを除いた内容で検索
    const cleanQuery = RECENT_KEYWORDS.reduce(
      (q, keyword) => q.replace(keyword, ''),
      query
    ).trim()

    // 最新記事を取得
    const recentPosts = getRecentPosts(10)

    if (cleanQuery) {
      // 残りのキーワードがある場合はベクトル検索も併用
      const queryVector = await embedText(cleanQuery)
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

      // 最新記事のslugでベクトル検索
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
