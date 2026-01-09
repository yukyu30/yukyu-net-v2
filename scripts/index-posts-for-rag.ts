import 'dotenv/config'
import { indexAllPosts } from '../src/lib/rag/indexer'

async function main() {
  console.log('Starting RAG indexing...')
  console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'set' : 'NOT SET')
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'set' : 'NOT SET')

  try {
    const { total, indexed } = await indexAllPosts()
    console.log(`\nIndexing complete!`)
    console.log(`Total posts: ${total}`)
    console.log(`Total chunks indexed: ${indexed}`)
  } catch (error) {
    console.error('Failed to index posts:', error)
    process.exit(1)
  }
}

main()
