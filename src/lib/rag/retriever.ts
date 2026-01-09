import { embedText } from './embeddings'
import { queryVectors } from './vector-store'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'

// 定数
const DEFAULT_TOP_K = 5
const RECENT_POSTS_LIMIT = 10
const RELATED_POSTS_PER_SLUG = 2
const MAX_RELATED_POSTS = 3
const DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})/
const MIN_SCORE_THRESHOLD = 0.5 // 関連性が低い結果を除外

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

interface RecentQueryResult {
  isRecent: boolean
  searchKeyword: string
}

interface GraphNode {
  id: string
  name: string
  tags: string[]
  date: string
  url: string
  group: string
}

interface GraphLink {
  source: string
  target: string
  value: number
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

// Next.jsのキャッシュを使用してメモリリークを防止
const loadGraphData = unstable_cache(
  async (): Promise<GraphData | null> => {
    try {
      const graphPath = path.join(process.cwd(), 'public', 'graph', 'graph-data.json')
      if (!fs.existsSync(graphPath)) return null

      return JSON.parse(fs.readFileSync(graphPath, 'utf-8'))
    } catch (error) {
      console.warn('Failed to load graph data:', error)
      return null
    }
  },
  ['graph-data'],
  { revalidate: 3600 } // 1時間キャッシュ
)

function extractDateFromSlug(slug: string): Date | null {
  const match = slug.match(DATE_PATTERN)
  return match ? new Date(match[1]) : null
}

async function classifyRecentQuery(query: string): Promise<RecentQueryResult> {
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
    const result = JSON.parse(response.choices[0]?.message?.content ?? '{}')
    return {
      isRecent: result.isRecent === true,
      searchKeyword: result.searchKeyword ?? '',
    }
  } catch {
    return { isRecent: false, searchKeyword: query }
  }
}

export async function getRelatedPosts(slug: string, limit = MAX_RELATED_POSTS): Promise<RelatedPost[]> {
  const graph = await loadGraphData()
  if (!graph) return []

  return graph.links
    .filter(link => link.source === slug || link.target === slug)
    .map(link => {
      const targetSlug = link.source === slug ? link.target : link.source
      const node = graph.nodes.find(n => n.id === targetSlug)
      return node ? { slug: targetSlug, title: node.name, similarity: link.value } : null
    })
    .filter((post): post is RelatedPost => post !== null)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

export async function getRecentPosts(limit = DEFAULT_TOP_K): Promise<Array<{ slug: string; title: string; date: string }>> {
  const graph = await loadGraphData()
  if (!graph) return []

  return graph.nodes
    .map(node => ({ node, date: extractDateFromSlug(node.id) }))
    .filter((item): item is { node: GraphNode; date: Date } => item.date !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
    .map(({ node }) => ({ slug: node.id, title: node.name, date: node.date }))
}

async function searchRecentWithKeyword(searchKeyword: string, topK: number): Promise<SearchResult[]> {
  const queryVector = await embedText(searchKeyword)
  const vectorResults = await queryVectors(queryVector, topK * 3)

  return vectorResults
    .filter(result => result.score >= MIN_SCORE_THRESHOLD)
    .map(result => ({
      slug: result.metadata.slug,
      title: result.metadata.title,
      text: result.metadata.text,
      score: result.score,
      chunkIndex: result.metadata.chunkIndex,
      date: extractDateFromSlug(result.metadata.slug),
    }))
    .filter(result => result.date !== null)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, topK)
    .map(({ date, ...rest }) => rest)
}

function getRecentPostsAsResults(topK: number): SearchResult[] {
  const recentPosts = getRecentPosts(RECENT_POSTS_LIMIT)

  return recentPosts.slice(0, topK).map(post => ({
    slug: post.slug,
    title: post.title,
    text: `${post.title} (${post.date})`,
    score: 1,
    chunkIndex: 0,
  }))
}

export async function searchPosts(query: string, topK = DEFAULT_TOP_K): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const { isRecent, searchKeyword } = await classifyRecentQuery(query)

  if (isRecent) {
    return searchKeyword
      ? searchRecentWithKeyword(searchKeyword, topK)
      : getRecentPostsAsResults(topK)
  }

  const queryVector = await embedText(query)
  // スコアフィルタリング用に多めに取得
  const results = await queryVectors(queryVector, topK * 2)

  return results
    .filter(result => result.score >= MIN_SCORE_THRESHOLD)
    .slice(0, topK)
    .map(result => ({
      slug: result.metadata.slug,
      title: result.metadata.title,
      text: result.metadata.text,
      score: result.score,
      chunkIndex: result.metadata.chunkIndex,
    }))
}

export async function searchWithRelated(
  query: string,
  topK = DEFAULT_TOP_K
): Promise<{ results: SearchResult[]; relatedPosts: RelatedPost[] }> {
  const results = await searchPosts(query, topK)
  const uniqueSlugs = [...new Set(results.map(r => r.slug))]

  const allRelated = uniqueSlugs.flatMap(slug => getRelatedPosts(slug, RELATED_POSTS_PER_SLUG))

  const seenSlugs = new Set(uniqueSlugs)
  const relatedPosts = allRelated
    .filter(post => {
      if (seenSlugs.has(post.slug)) return false
      seenSlugs.add(post.slug)
      return true
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MAX_RELATED_POSTS)

  return { results, relatedPosts }
}
