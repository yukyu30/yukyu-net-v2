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

export async function searchPosts(
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  // クエリをEmbeddingに変換
  const queryVector = await embedText(query)

  // ベクトル検索
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
