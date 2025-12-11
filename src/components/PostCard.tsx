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

  const borderClasses = `${
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
  } ${(index + 1) % 3 !== 0 ? '' : 'lg:border-r-0'}`

  // スタガーアニメーション用のdelay計算
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
        className={`${borderClasses} animate-stagger-in`}
        style={{ animationDelay }}
      >
        <a
          href={`/posts/${post.slug}`}
          onClick={handleClick}
          className="block h-full cursor-pointer"
        >
          <div className="p-6 h-full flex flex-col hover:bg-gray-50 transition-colors">
          <div className="border-b border-black pb-2 mb-3">
            <time className="text-xs font-mono">{post.date}</time>
          </div>
          {post.thumbnail && (
            <div className="mb-3 relative aspect-video bg-gray-100 overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <h2 className="text-lg font-bold mb-3 leading-tight">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed line-clamp-4 flex-grow">
            {post.excerpt}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-1 border border-black"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-300">
            <span className="text-xs font-mono uppercase">
              Read →
            </span>
          </div>
        </div>
        </a>
      </article>
    </>
  )
}