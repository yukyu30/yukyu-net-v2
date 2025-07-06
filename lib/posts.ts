import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkEmbedder from '@remark-embedder/core';
import { remarkEmbedderConfig } from './remark-embedder-config';
import { remarkLinkCard } from './remark-link-card';

const postsDirectory = path.join(process.cwd(), 'articles');

export interface PostData {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
  content?: string;
  contentHtml?: string;
  excerpt?: string;
}

export const POSTS_PER_PAGE = 10;

function getExcerpt(content: string): string {
  // Remove markdown formatting and get first 20 characters
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#+\s/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  return plainText.substring(0, 20) + (plainText.length > 20 ? '...' : '');
}

export function getSortedPostsData(): PostData[] {
  // Get folder names under /public_articles
  const folderNames = fs.readdirSync(postsDirectory);
  const allPostsData = folderNames
    .filter((folderName) => {
      // Filter out non-post folders like README.md, me, privacy-policy
      const folderPath = path.join(postsDirectory, folderName);
      return fs.statSync(folderPath).isDirectory() && 
             !['me', 'privacy-policy'].includes(folderName) &&
             fs.existsSync(path.join(folderPath, 'index.md'));
    })
    .map((folderName) => {
      const slug = folderName;
      const fullPath = path.join(postsDirectory, folderName, 'index.md');
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Get excerpt from content
      const excerpt = getExcerpt(matterResult.content);

      // Combine the data with the slug
      return {
        slug,
        id: matterResult.data.id,
        title: matterResult.data.title,
        created_at: matterResult.data.created_at,
        updated_at: matterResult.data.updated_at,
        excerpt,
      } as PostData;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getAllPostSlugs() {
  const folderNames = fs.readdirSync(postsDirectory);
  return folderNames
    .filter((folderName) => {
      const folderPath = path.join(postsDirectory, folderName);
      return fs.statSync(folderPath).isDirectory() && 
             !['me', 'privacy-policy'].includes(folderName) &&
             fs.existsSync(path.join(folderPath, 'index.md'));
    })
    .map((folderName) => {
      return {
        params: {
          slug: folderName,
        },
      };
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Replace relative image paths with static file paths
  let content = matterResult.content;
  content = content.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    `![$1](/articles/${slug}/$2)`
  );

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkLinkCard)
    .use(remarkEmbedder, remarkEmbedderConfig)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  // Combine the data with the slug and contentHtml
  return {
    slug,
    id: matterResult.data.id,
    title: matterResult.data.title,
    created_at: matterResult.data.created_at,
    updated_at: matterResult.data.updated_at,
    content: matterResult.content,
    contentHtml,
  };
}