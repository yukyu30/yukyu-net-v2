import { generateRSSFeed } from '@/lib/rss'

export async function GET() {
  const rss = generateRSSFeed()
  
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}