'use client'

import { useState } from 'react'
import { Post } from '@/lib/posts'
import UnlockTransition from './UnlockTransition'

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)

  const animationDelay = `${index * 50}ms`

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsUnlocking(true)
  }

  return (
    <>
      {isUnlocking && (
        <UnlockTransition
          href={`/posts/${post.slug}`}
          onComplete={() => setIsUnlocking(false)}
        />
      )}
      <article
        className="m-2 animate-stagger-in h-full"
        style={{ animationDelay }}
      >
        <a
          href={`/posts/${post.slug}`}
          onClick={handleClick}
          className="block cursor-pointer group h-full"
        >
          {/* ドキュメントアイコン風のカード */}
          <div className="border border-green-400 bg-black group-hover:bg-green-400/5 transition-colors h-full flex flex-col">
            {/* ドキュメントヘッダー（ファイル情報） */}
            <div className="px-3 py-2 border-b border-green-600 flex items-center gap-2">
              {/* ファイルアイコン */}
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-mono text-green-600 truncate">{post.slug}.md</span>
              <span className="text-xs font-mono text-green-600 ml-auto flex-shrink-0">{post.date}</span>
            </div>

            {/* サムネイル */}
            {post.thumbnail && (
              <div className="mx-3 mt-3 relative aspect-video bg-green-950 overflow-hidden border border-green-600">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </div>
            )}

            {/* コンテンツ */}
            <div className="p-3 flex-1 flex flex-col">
              <h2 className="text-base font-bold mb-2 leading-tight group-hover:text-green-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed line-clamp-2 text-green-600 flex-1">
                {post.excerpt}
              </p>

              {/* タグ */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-green-600"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* フッター（ステータス行風） */}
            <div className="px-3 py-2 border-t border-green-600 bg-green-400/5 mt-auto">
              <span className="text-xs font-mono text-green-400">
                &gt;_ OPEN
              </span>
            </div>
          </div>
        </a>
      </article>
    </>
  )
}
