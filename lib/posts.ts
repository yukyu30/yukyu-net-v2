import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'public_articles');

export interface PostData {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
  content?: string;
  contentHtml?: string;
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

      // Combine the data with the slug
      return {
        slug,
        id: matterResult.data.id,
        title: matterResult.data.title,
        created_at: matterResult.data.created_at,
        updated_at: matterResult.data.updated_at,
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

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
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