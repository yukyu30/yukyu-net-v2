import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'public_articles')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content?: string
}

export function getAllPosts(): Post[] {
  const excludeDirs = ['README', 'me', 'privacy-policy']
  
  const directories = fs.readdirSync(postsDirectory)
    .filter(dir => {
      const fullPath = path.join(postsDirectory, dir)
      return fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(dir)
    })

  const posts = directories.map(dir => {
    const slug = dir
    const indexPath = path.join(postsDirectory, dir, 'index.md')
    
    if (!fs.existsSync(indexPath)) {
      return null
    }

    const fileContents = fs.readFileSync(indexPath, 'utf8')
    const { data, content } = matter(fileContents)

    const excerpt = content
      .replace(/^#+\s+/gm, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .substring(0, 200)
      .trim() + '...'

    return {
      slug,
      title: data.title || slug,
      date: data.date || slug,
      excerpt: data.excerpt || excerpt,
    }
  }).filter((post): post is Post => post !== null)

  return posts.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postPath = path.join(postsDirectory, slug)
  const indexPath = path.join(postPath, 'index.md')

  if (!fs.existsSync(indexPath)) {
    return null
  }

  const fileContents = fs.readFileSync(indexPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = content.replace(
    /!\[(.*?)\]\(((?!http|https|\/)[^)]+)\)/g,
    (match, alt, src) => {
      return `![${alt}](/public_articles/${slug}/${src})`
    }
  )

  const processedMarkdown = await remark()
    .use(html)
    .process(processedContent)
  
  const contentHtml = processedMarkdown.toString()

  const excerpt = content
    .replace(/^#+\s+/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .substring(0, 200)
    .trim() + '...'

  return {
    slug,
    title: data.title || slug,
    date: data.date || slug,
    excerpt: data.excerpt || excerpt,
    content: contentHtml,
  }
}