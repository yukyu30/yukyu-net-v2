import fs from 'fs'
import path from 'path'
import { getAllPosts, getPostBySlug } from '../posts'
import { embedMany } from './embeddings'
import { initializeIndex, upsertVectors, deleteVectorsBySlug } from './vector-store'

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50
const CACHE_FILE_PATH = path.join(process.cwd(), 'public/rag/indexed-slugs.json')

interface IndexCache {
  slugs: string[]
  lastUpdated: string
}

function loadIndexedSlugs(): Set<string> {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf-8')) as IndexCache
      return new Set(data.slugs)
    }
  } catch (error) {
    console.warn('Failed to load indexed slugs cache:', error)
  }
  return new Set()
}

function saveIndexedSlugs(slugs: Set<string>): void {
  const dir = path.dirname(CACHE_FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const cache: IndexCache = {
    slugs: Array.from(slugs),
    lastUpdated: new Date().toISOString(),
  }
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2))
}

export interface Chunk {
  text: string
  slug: string
  title: string
  chunkIndex: number
}

export function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start += chunkSize - overlap
    
    if (start >= text.length) break
  }

  return chunks
}

export async function indexPost(slug: string): Promise<number> {
  const post = await getPostBySlug(slug)
  if (!post || !post.content) {
    return 0
  }

  // 既存のベクトルを削除
  await deleteVectorsBySlug(slug)

  // Markdownのコンテンツをチャンク分割
  const textChunks = chunkText(post.content)
  if (textChunks.length === 0) {
    return 0
  }

  // チャンクのメタデータを作成
  const chunks: Chunk[] = textChunks.map((text, index) => ({
    text,
    slug: post.slug,
    title: post.title,
    chunkIndex: index,
  }))

  // Embeddingを生成
  const embeddings = await embedMany(textChunks)

  // ベクトルストアに保存
  await upsertVectors(embeddings, chunks)

  return chunks.length
}

export async function indexAllPosts(): Promise<{ total: number; indexed: number }> {
  // インデックスを初期化
  await initializeIndex()

  const posts = await getAllPosts()
  let indexed = 0

  for (const post of posts) {
    try {
      const chunkCount = await indexPost(post.slug)
      indexed += chunkCount
      console.log(`Indexed ${post.slug}: ${chunkCount} chunks`)
    } catch (error) {
      console.error(`Failed to index ${post.slug}:`, error)
    }
  }

  return { total: posts.length, indexed }
}

export async function indexNewPostsOnly(): Promise<{ total: number; skipped: number; indexed: number }> {
  // インデックスを初期化
  await initializeIndex()

  const posts = await getAllPosts()
  const indexedSlugs = loadIndexedSlugs()
  let indexed = 0
  let skipped = 0

  for (const post of posts) {
    if (indexedSlugs.has(post.slug)) {
      skipped++
      console.log(`Skipped ${post.slug} (already indexed)`)
      continue
    }

    try {
      const chunkCount = await indexPost(post.slug)
      indexed += chunkCount
      indexedSlugs.add(post.slug)
      console.log(`Indexed ${post.slug}: ${chunkCount} chunks`)
    } catch (error) {
      console.error(`Failed to index ${post.slug}:`, error)
    }
  }

  // キャッシュを保存
  saveIndexedSlugs(indexedSlugs)

  return { total: posts.length, skipped, indexed }
}

export { CHUNK_SIZE, CHUNK_OVERLAP }
