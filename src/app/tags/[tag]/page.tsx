import { getPostsByTag, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import GridLayout from '@/components/GridLayout'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const tags = getAllTags()
  return Array.from(tags.keys()).map((tag) => ({
    tag: tag,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  
  return {
    title: `${tag} - yukyu.net`,
    description: `${tag}タグが付いた記事一覧`,
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const posts = getPostsByTag(tag)
  
  if (posts.length === 0) {
    notFound()
  }

  return (
    <GridLayout 
      postsCount={posts.length} 
      lastUpdate={posts[0]?.date}
      showProfile={false}
      currentTag={tag}
    >
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </GridLayout>
  )
}