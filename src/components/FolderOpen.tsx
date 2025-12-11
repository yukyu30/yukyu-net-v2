'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface FolderOpenProps {
  onComplete: () => void
}

export default function FolderOpen({ onComplete }: FolderOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const folderRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete,
        })
      },
    })

    // フォルダ登場
    tl.fromTo(
      folderRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )

    // 少し待機
    tl.to({}, { duration: 0.3 })

    // 本/貝のように開く（上半分が奥に倒れる）
    tl.to(topRef.current, {
      rotateX: -70,
      duration: 0.5,
      ease: 'power2.out',
    }, 'open')

    // 下半分が手前に倒れる
    tl.to(bottomRef.current, {
      rotateX: 70,
      duration: 0.5,
      ease: 'power2.out',
    }, 'open')

    // 開いた状態で少し待機
    tl.to({}, { duration: 0.3 })

    // フォルダが消える
    tl.to(folderRef.current, {
      scale: 1.2,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    })

  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ perspective: '800px' }}
    >
      <div
        ref={folderRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* フォルダ上半分（蓋）- 奥に倒れる */}
        <div
          ref={topRef}
          className="w-[200px] h-[80px] border-2 border-green-400 bg-green-400/50"
          style={{
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(0% 20%, 35% 20%, 42% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        {/* フォルダ下半分（本体）- 手前に倒れる */}
        <div
          ref={bottomRef}
          className="w-[200px] h-[80px] border-2 border-green-400 bg-green-400/30"
          style={{
            transformOrigin: 'center top',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>
    </div>
  )
}
