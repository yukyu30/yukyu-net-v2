import { getAllPosts, getPostBySlug } from '../posts'
import { embedMany } from './embeddings'
import { initializeIndex, upsertVectors, deleteVectorsBySlug } from './vector-store'

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

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

export { CHUNK_SIZE, CHUNK_OVERLAP }
