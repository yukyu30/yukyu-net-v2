import { getPostsByTag, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import GridLayout from '@/components/GridLayout'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const tags = getAllTags()
  return Array.from(tags.keys()).map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
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
  const decodedTag = decodeURIComponent(tag)
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