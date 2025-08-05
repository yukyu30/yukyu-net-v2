import { getPostBySlug, getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black">
        <div className="container mx-auto px-0">
          <div className="border-l-2 border-r-2 border-black mx-4">
            <div className="px-6 py-4 border-b border-black flex justify-between items-center">
              <Link href="/" className="text-sm font-mono uppercase hover:bg-black hover:text-white px-2 py-1 transition-colors">
                ← INDEX
              </Link>
              <span className="text-xs font-mono">ARTICLE VIEW</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <article className="max-w-4xl mx-auto">
            <div className="border-b-2 border-black">
              <div className="p-8">
                <div className="border-b border-black pb-4 mb-6">
                  <time className="text-xs font-mono uppercase">{post.date}</time>
                </div>
                <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
              </div>
            </div>
            
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-black prose-a:underline prose-a:font-semibold prose-img:border-2 prose-img:border-black prose-pre:bg-gray-100 prose-pre:border-2 prose-pre:border-black prose-code:bg-gray-100 prose-code:px-1 prose-code:font-mono"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />
            </div>
            
            <div className="border-t-2 border-black">
              <div className="p-8 flex justify-between items-center">
                <Link href="/" className="text-sm font-mono uppercase hover:bg-black hover:text-white px-3 py-2 border border-black transition-colors">
                  ← RETURN TO INDEX
                </Link>
                <div className="text-xs font-mono">
                  END OF ARTICLE
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <footer className="border-t-2 border-black mt-auto">
        <div className="container mx-auto px-0">
          <div className="border-l-2 border-r-2 border-black mx-4">
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-xs font-mono">© 2025 BLOG ARCHIVE</span>
              <div className="flex gap-4">
                <span className="text-xs font-mono">ARTICLE VIEW</span>
                <span className="text-xs font-mono">|</span>
                <span className="text-xs font-mono">V1.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}