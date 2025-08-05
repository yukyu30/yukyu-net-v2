import { getAllPosts } from './posts'
import fs from 'fs'
import path from 'path'

export function generateRSSFeed(): string {
  const posts = getAllPosts()
  const siteUrl = process.env.SITE_URL || 'https://yukyu.net'
  const feedUrl = `${siteUrl}/rss.xml`
  
  const rssItems = posts.slice(0, 20).map(post => {
    const postUrl = `${siteUrl}/posts/${post.slug}`
    const pubDate = new Date(post.date).toUTCString()
    
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DecoBoco Digital</title>
    <link>${siteUrl}</link>
    <description>A collection of thoughts and writings</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  return rss
}

export function writeRSSFeed(): void {
  const rss = generateRSSFeed()
  const publicPath = path.join(process.cwd(), 'public', 'rss.xml')
  fs.writeFileSync(publicPath, rss, 'utf-8')
  console.log('RSS feed generated at public/rss.xml')
}