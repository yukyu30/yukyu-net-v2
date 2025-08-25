import { getPostsByTag, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import GridLayout from '@/components/GridLayout'
import { Metadata } from 'next'

export const dynamicParams = true

export async function generateStaticParams() {
  const tags = getAllTags()
  const params: { tag: string }[] = []
  
  // 日本語タグとエンコードされたタグの両方を生成
  Array.from(tags.keys()).forEach((tag) => {
    // 日本語のまま
    params.push({ tag: tag })
    // エンコード版も追加
    const encoded = encodeURIComponent(tag)
    if (encoded !== tag) {
      params.push({ tag: encoded })
    }
  })
  
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  // URLエンコードされている場合はデコード、そうでなければそのまま
  let decodedTag = tag
  try {
    decodedTag = decodeURIComponent(tag)
  } catch {
    // デコードに失敗した場合はそのまま使用
  }
  
  return {
    title: `${decodedTag} - yukyu.net`,
    description: `${decodedTag}タグが付いた記事一覧`,
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  // URLエンコードされている場合はデコード、そうでなければそのまま
  let decodedTag = tag
  try {
    decodedTag = decodeURIComponent(tag)
  } catch {
    // デコードに失敗した場合はそのまま使用
  }
  const posts = getPostsByTag(decodedTag)
  
  if (posts.length === 0) {
    notFound()
  }

  return (
    <GridLayout 
      postsCount={posts.length} 
      lastUpdate={posts[0]?.date}
      showProfile={false}
      currentTag={decodedTag}
    >
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </GridLayout>
  )
}