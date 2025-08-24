import { getAllPosts } from '@/lib/posts'
import { getPaginatedPosts, getTotalPages } from '@/lib/pagination'
import GridLayout from '@/components/GridLayout'
import PostCard from '@/components/PostCard'
import ProfileSection from '@/components/ProfileSection'
import Pagination from '@/components/Pagination'

export default function Home() {
  const allPosts = getAllPosts()
  const currentPage = 1
  const posts = getPaginatedPosts(allPosts, currentPage)
  const totalPages = getTotalPages(allPosts.length)

  return (
    <GridLayout 
      postsCount={allPosts.length} 
      lastUpdate={allPosts[0]?.date}
      showProfile={true}
      pagination={
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          basePath="/" 
        />
      }
    >
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </GridLayout>
  )
}