import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black">
        <div className="container mx-auto px-0">
          <div className="border-l-2 border-r-2 border-black mx-4">
            <div className="px-6 py-4 border-b-2 border-black">
              <h1 className="text-4xl font-bold tracking-tight">
                DecoBoco Digital
              </h1>
            </div>
            <div className="flex border-black">
              <div className="px-6 py-2 border-r border-black">
                <span className="text-xs font-mono">
                  ENTRIES: {posts.length}
                </span>
              </div>
              <div className="px-6 py-2 border-r border-black">
                <span className="text-xs font-mono">
                  LAST UPDATE: {posts[0]?.date || 'N/A'}
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-0 relative">
        <div className="absolute -left-12 top-8">
          <div className="border border-black bg-white">
            <div className="px-1 py-2">
              <div
                className="text-xs font-mono tracking-wider"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                YUKYU'S DIARY
              </div>
            </div>
            <div className="border-t border-black px-1 py-2">
              <div
                className="text-xs font-mono tracking-wider"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                PERSONAL ARCHIVE
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 top-8">
          <div className="border border-black bg-white">
            <div className="px-1 py-2">
              <div
                className="text-xs font-mono tracking-wider"
                style={{ writingMode: 'vertical-lr' }}
              >
                WRITTEN BY YUKYU
              </div>
            </div>
            <div className="border-t border-black px-1 py-2">
              <div
                className="text-xs font-mono tracking-wider"
                style={{ writingMode: 'vertical-lr' }}
              >
                {new Date().getFullYear()} ARCHIVE
              </div>
            </div>
          </div>
        </div>
        <div className="border-l-2 border-r-2 border-black mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className={`${
                  index === 0
                    ? ''
                    : index === 1
                      ? 'border-t-2 md:border-t-0 lg:border-t-0'
                      : index === 2
                        ? 'border-t-2 md:border-t-2 lg:border-t-0'
                        : 'border-t-2'
                } border-black ${
                  (index + 1) % 3 !== 0 ? 'lg:border-r-2' : ''
                } ${
                  (index + 1) % 2 !== 0 ? 'md:border-r-2' : 'md:border-r-0'
                } ${(index + 1) % 3 !== 0 ? '' : 'lg:border-r-0'}`}
              >
                <Link href={`/posts/${post.slug}`} className="block h-full">
                  <div className="p-6 hover:bg-gray-50 transition-colors h-full flex flex-col">
                    <div className="border-b border-black pb-2 mb-3">
                      <time className="text-xs font-mono">{post.date}</time>
                    </div>
                    <h2 className="text-lg font-bold mb-3 leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed line-clamp-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-300">
                      <span className="text-xs font-mono uppercase">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-black mt-auto">
        <div className="container mx-auto px-0">
          <div className="border-l-2 border-r-2 border-black mx-4">
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-xs font-mono">
                © 2025 DecoBoco Digital
              </span>
              <div className="flex gap-4">
                <span className="text-xs font-mono">GRID LAYOUT</span>
                <span className="text-xs font-mono">|</span>
                <span className="text-xs font-mono">V1.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
