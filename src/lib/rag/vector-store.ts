import { LibSQLVector } from '@mastra/libsql'

const INDEX_NAME = 'blog_posts'
const EMBEDDING_DIMENSION = 1536

let vectorStore: LibSQLVector | null = null

export function getVectorStore(): LibSQLVector {
  if (vectorStore) {
    return vectorStore
  }

  const connectionUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!connectionUrl) {
    throw new Error('TURSO_DATABASE_URL is not set')
  }

  vectorStore = new LibSQLVector({
    connectionUrl,
    authToken,
  })

  return vectorStore
}

export async function initializeIndex(): Promise<void> {
  const store = getVectorStore()
  await store.createIndex({
    indexName: INDEX_NAME,
    dimension: EMBEDDING_DIMENSION,
  })
}

export async function upsertVectors(
  vectors: number[][],
  metadata: Array<{
    text: string
    slug: string
    title: string
    chunkIndex: number
  }>
): Promise<void> {
  const store = getVectorStore()
  await store.upsert({
    indexName: INDEX_NAME,
    vectors,
    metadata,
  })
}

export async function queryVectors(
  queryVector: number[],
  topK: number = 5
): Promise<
  Array<{
    id: string
    score: number
    metadata: {
      text: string
      slug: string
      title: string
      chunkIndex: number
    }
  }>
> {
  const store = getVectorStore()
  const results = await store.query({
    indexName: INDEX_NAME,
    queryVector,
    topK,
  })
  return results as Array<{
    id: string
    score: number
    metadata: {
      text: string
      slug: string
      title: string
      chunkIndex: number
    }
  }>
}

export async function deleteVectorsBySlug(slug: string): Promise<void> {
  const store = getVectorStore()
  await store.deleteVectors({
    indexName: INDEX_NAME,
    filter: { slug },
  })
}

export { INDEX_NAME, EMBEDDING_DIMENSION }
