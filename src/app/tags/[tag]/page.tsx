import { getPostsByTag, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'

export async function generateStaticParams() {
  const tags = getAllTags()
  return Array.from(tags.keys()).map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBackButton={false} pageType="index" />
      
      <main className="container mx-auto px-0 flex-grow">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <div className="border-b-2 border-black">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold mb-2">#{decodedTag}</h1>
              <p className="text-sm font-mono">
                {posts.length} {posts.length === 1 ? 'ARTICLE' : 'ARTICLES'} FOUND
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ArticleCard 
                key={post.slug} 
                post={post}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
      
      <Footer variant="grid" />
    </div>
  )
}