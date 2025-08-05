import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">My Blog</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500">{post.date}</time>
                <p className="mt-3 text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}