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
          <div className="px-4 py-3">
            <p className="text-sm font-mono text-green-600">
              {tags.size} {tags.size === 1 ? 'TAG' : 'TAGS'} FOUND
            </p>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {sortedTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="font-mono text-sm text-green-600 hover:text-green-400 transition-colors"
                >
                  [#{tag} ({count})]
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
