'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface FolderOpenProps {
  onComplete: () => void
}

export default function FolderOpen({ onComplete }: FolderOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const folderRef = useRef<SVGSVGElement>(null)
  const lidRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // フォルダが消えてからコールバック
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

    // フォルダの蓋が開く
    tl.to(lidRef.current, {
      attr: { d: 'M 8 4 L 40 4 L 44 8 L 4 8 Z' }, // 蓋が上に開く
      duration: 0.4,
      ease: 'power2.out',
    })

    // 蓋が開いた状態で少し待機
    tl.to({}, { duration: 0.2 })

    // フォルダが上に浮いて消える準備
    tl.to(folderRef.current, {
      y: -20,
      scale: 1.1,
      duration: 0.25,
      ease: 'power1.in',
    })

  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <svg
        ref={folderRef}
        width="120"
        height="100"
        viewBox="0 0 48 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-green-400"
      >
        {/* フォルダ本体 */}
        <path
          d="M 4 12 L 4 36 L 44 36 L 44 12 L 24 12 L 20 8 L 4 8 Z"
          fill="none"
        />
        {/* フォルダの蓋（アニメーション対象） */}
        <path
          ref={lidRef}
          d="M 4 12 L 44 12 L 44 8 L 20 8 L 16 4 L 4 4 Z"
          fill="none"
        />
        {/* フォルダのタブ */}
        <path d="M 4 8 L 16 8 L 20 12" fill="none" />
      </svg>
    </div>
  )
}
