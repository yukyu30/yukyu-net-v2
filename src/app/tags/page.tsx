import { getAllTags } from '@/lib/posts'
import Link from 'next/link'
import MenuBar from '@/components/MenuBar'
import StatusBar from '@/components/StatusBar'
import WindowFrame from '@/components/WindowFrame'

export default function TagsPage() {
  const tags = getAllTags()
  const sortedTags = Array.from(tags.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <MenuBar />

      <main className="flex-1 p-4">
        <WindowFrame title="ALL TAGS">
          <div className="border-b border-green-400 px-4 py-3">
            <p className="text-sm font-mono text-green-600">
              {tags.size} {tags.size === 1 ? 'TAG' : 'TAGS'} FOUND
            </p>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {sortedTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="group border border-green-400 p-3 hover:bg-green-400 hover:text-black transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">#{tag}</span>
                    <span className="font-mono text-xs text-green-600 group-hover:text-black">
                      [{count}]
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </WindowFrame>
      </main>

      <StatusBar status="VIEWING TAGS" />
    </div>
  )
}
