import { getPostsByTag } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import GridLayout from '@/components/GridLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Works - yukyu.net',
  description: '作品・プロジェクト一覧',
}

export default function WorksPage() {
  const posts = getPostsByTag('work')

  return (
    <GridLayout 
      postsCount={posts.length} 
      lastUpdate={posts[0]?.date}
      showProfile={false}
      currentTag="work"
    >
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </GridLayout>
  )
}