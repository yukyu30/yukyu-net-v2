'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Post } from '@/lib/posts'
import UnlockTransition from './UnlockTransition'

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsUnlocking(true)
  }

  useEffect(() => {
    if (cardRef.current) {
      // フォルダから出てくるアニメーション
      // 左上の一点（フォルダの位置）から各位置へ展開
      const delay = index * 0.03 // より速いスタガー

      // 初期位置: 左上のフォルダ位置（重なった状態）
      gsap.set(cardRef.current, {
        x: -300,
        y: -200,
        opacity: 0,
        scale: 0.3,
        rotation: -15 + (index % 5) * 3, // ファイルが少しバラけた角度
      })

      // アニメーション: フォルダから出てきて整列
      gsap.to(cardRef.current, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        delay: delay,
        ease: 'power3.out',
      })
    }
  }, [index])

  return (
    <>
      {isUnlocking && (
        <UnlockTransition
          href={`/posts/${post.slug}`}
          onComplete={() => setIsUnlocking(false)}
        />
      )}
      <article
        ref={cardRef}
        className="p-2 h-full opacity-0"
      >
        <a
          href={`/posts/${post.slug}`}
          onClick={handleClick}
          className="block cursor-pointer group h-full"
        >
          <div className="bg-black group-hover:bg-green-950/50 transition-colors h-full flex flex-col p-4">
            {/* ヘッダー */}
            <div className="flex items-center gap-2 mb-3 text-green-600">
              <span className="text-sm font-mono">{post.slug}.md</span>
              <span className="text-sm font-mono ml-auto">{post.date}</span>
            </div>

            {/* サムネイル */}
            {post.thumbnail && (
              <div className="mb-3 relative aspect-video bg-green-950 overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  loading="lazy"
                />
              </div>
            )}

            {/* コンテンツ */}
            <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-green-300 transition-colors">
              {post.title}
            </h2>
            <p className="text-base leading-relaxed line-clamp-3 text-green-600 flex-1">
              {post.excerpt}
            </p>

            {/* タグ */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mt-3 text-sm font-mono text-green-600">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag}>[{tag}]</span>
                ))}
              </div>
            )}

            {/* フッター */}
            <div className="mt-3 pt-3 border-t border-green-800">
              <span className="text-sm font-mono text-green-400">
                &gt;_ OPEN
              </span>
            </div>
          </div>
        </a>
      </article>
    </>
  )
}
