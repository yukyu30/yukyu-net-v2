import 'dotenv/config'
import { indexAllPosts, indexNewPostsOnly } from '../src/lib/rag/indexer'

const isIncremental = process.argv.includes('--incremental')

async function main() {
  console.log('Starting RAG indexing...')
  console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'set' : 'NOT SET')
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'set' : 'NOT SET')
  console.log('Mode:', isIncremental ? 'incremental' : 'full')

  try {
    if (isIncremental) {
      const { total, skipped, indexed, deleted } = await indexNewPostsOnly()
      console.log(`\nIndexing complete!`)
      console.log(`Total posts: ${total}`)
      console.log(`Skipped (unchanged): ${skipped}`)
      console.log(`Newly indexed chunks: ${indexed}`)
      console.log(`Deleted (removed posts): ${deleted}`)
    } else {
      const { total, indexed } = await indexAllPosts()
      console.log(`\nIndexing complete!`)
      console.log(`Total posts: ${total}`)
      console.log(`Total chunks indexed: ${indexed}`)
    }
  } catch (error) {
    console.error('Failed to index posts:', error)
    process.exit(1)
  }
}

main()
