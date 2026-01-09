import { LibSQLVector } from '@mastra/libsql'
import { createClient, Client } from '@libsql/client'

const INDEX_NAME = 'blog_posts'
const EMBEDDING_DIMENSION = 1536

let vectorStore: LibSQLVector | null = null
let dbClient: Client | null = null

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

function getDbClient(): Client {
  if (dbClient) {
    return dbClient
  }

  const connectionUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!connectionUrl) {
    throw new Error('TURSO_DATABASE_URL is not set')
  }

  dbClient = createClient({
    url: connectionUrl,
    authToken,
  })

  return dbClient
}

// DBクライアントをクローズ（サーバーレス環境でのリソースリーク防止）
export async function closeDbClient(): Promise<void> {
  if (dbClient) {
    dbClient.close()
    dbClient = null
  }
  vectorStore = null
}

export async function initializeIndex(): Promise<void> {
  const store = getVectorStore()
  await store.createIndex({
    indexName: INDEX_NAME,
    dimension: EMBEDDING_DIMENSION,
  })
  
  // ハッシュキャッシュテーブルを作成
  const client = getDbClient()
  await client.execute(`
    CREATE TABLE IF NOT EXISTS post_hash_cache (
      slug TEXT PRIMARY KEY,
      content_hash TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)
}

// ハッシュキャッシュを取得
export async function loadHashCache(): Promise<Map<string, string>> {
  const client = getDbClient()
  const result = await client.execute('SELECT slug, content_hash FROM post_hash_cache')
  
  const map = new Map<string, string>()
  for (const row of result.rows) {
    if (typeof row.slug === 'string' && typeof row.content_hash === 'string') {
      map.set(row.slug, row.content_hash)
    } else {
      console.warn('Invalid row data in post_hash_cache:', row)
    }
  }
  return map
}

// ハッシュキャッシュを保存（個別にupsert）
export async function saveHashToCache(slug: string, contentHash: string): Promise<void> {
  const client = getDbClient()
  await client.execute({
    sql: `
      INSERT INTO post_hash_cache (slug, content_hash, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET content_hash = ?, updated_at = ?
    `,
    args: [slug, contentHash, new Date().toISOString(), contentHash, new Date().toISOString()]
  })
}

// キャッシュからslugを削除
export async function deleteHashFromCache(slug: string): Promise<void> {
  const client = getDbClient()
  await client.execute({
    sql: 'DELETE FROM post_hash_cache WHERE slug = ?',
    args: [slug]
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
