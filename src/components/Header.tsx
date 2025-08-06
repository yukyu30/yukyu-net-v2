import Link from 'next/link'

interface HeaderProps {
  postsCount?: number
  lastUpdate?: string
  showBackButton?: boolean
  pageType?: 'index' | 'article'
}

export default function Header({ 
  postsCount, 
  lastUpdate, 
  showBackButton = false,
  pageType = 'index' 
}: HeaderProps) {
  return (
    <header className="border-b-2 border-black">
      <div className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          {showBackButton ? (
            <div className="px-6 py-4 border-b border-black flex justify-between items-center">
              <Link href="/" className="text-sm font-mono uppercase hover:bg-black hover:text-white px-2 py-1 transition-colors">
                ← INDEX
              </Link>
              <span className="text-xs font-mono">ARTICLE VIEW</span>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b-2 border-black">
                <h1 className="text-4xl font-bold tracking-tight">
                  DecoBoco Digital
                </h1>
              </div>
              <div className="flex border-black">
                <div className="px-6 py-2 border-r border-black">
                  <span className="text-xs font-mono">
                    ENTRIES: {postsCount}
                  </span>
                </div>
                <div className="px-6 py-2 border-r border-black">
                  <span className="text-xs font-mono">
                    LAST UPDATE: {lastUpdate || 'N/A'}
                  </span>
                </div>
                <div className="px-6 py-2 flex-grow">
                  <span className="text-xs font-mono">STATUS: ACTIVE</span>
                </div>
                <Link 
                  href="/rss.xml" 
                  className="px-4 py-2 border-l-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                  aria-label="RSS Feed"
                >
                  <span className="text-xs font-mono font-bold">RSS</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}