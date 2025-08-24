import { getAllPosts } from '@/lib/posts'
import { getPaginatedPosts, getTotalPages } from '@/lib/pagination'
import GridLayout from '@/components/GridLayout'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = getAllPosts()
  const totalPages = getTotalPages(posts.length)
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const { page } = await params
  
  return {
    title: `ページ ${page} - yukyu.net`,
    description: `記事一覧 - ページ ${page}`,
  }
}

export default async function PaginatedHomePage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const currentPage = parseInt(page, 10)
  
  if (isNaN(currentPage) || currentPage < 1) {
    notFound()
  }

  const allPosts = getAllPosts()
  const totalPages = getTotalPages(allPosts.length)
  
  if (currentPage > totalPages) {
    notFound()
  }

  const posts = getPaginatedPosts(allPosts, currentPage)

  return (
    <GridLayout 
      postsCount={allPosts.length} 
      lastUpdate={allPosts[0]?.date}
      showProfile={false}
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