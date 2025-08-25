import { getAllTags } from '@/lib/posts'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TagsPage() {
  const tags = getAllTags()
  const sortedTags = Array.from(tags.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBackButton={false} pageType="index" />
      
      <main className="container mx-auto px-0 flex-grow">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <div className="border-b-2 border-black">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold mb-2">ALL TAGS</h1>
              <p className="text-sm font-mono">
                {tags.size} {tags.size === 1 ? 'TAG' : 'TAGS'} FOUND
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="group border-2 border-black p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">#{tag}</span>
                    <span className="font-mono text-xs opacity-60">
                      {count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer variant="grid" />
    </div>
  )
}