import { getAllPosts } from '@/lib/posts'
import GridLayout from '@/components/GridLayout'
import PostCard from '@/components/PostCard'
import ProfileSection from '@/components/ProfileSection'

export default function Home() {
  const posts = getAllPosts()

  return (
    <>
      <GridLayout 
        postsCount={posts.length} 
        lastUpdate={posts[0]?.date}
        showProfile={true}
      >
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))}
      </GridLayout>
    </>
  )
}