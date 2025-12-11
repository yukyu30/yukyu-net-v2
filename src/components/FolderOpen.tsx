'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface FolderOpenProps {
  onComplete: () => void
}

export default function FolderOpen({ onComplete }: FolderOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const folderRef = useRef<SVGSVGElement>(null)
  const lidRef = useRef<SVGGElement>(null)

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

    // フォルダの蓋が手前に開く（X軸回転をscaleYで表現）
    tl.to(lidRef.current, {
      scaleY: 0.1,
      y: -8,
      duration: 0.4,
      ease: 'power2.out',
      transformOrigin: 'center top',
    })

    // 蓋が開いた状態で少し待機
    tl.to({}, { duration: 0.2 })

    // フォルダが上に浮いて消える
    tl.to(folderRef.current, {
      y: -20,
      scale: 1.1,
      opacity: 0,
      duration: 0.3,
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
        width="200"
        height="160"
        viewBox="0 0 48 44"
        className="text-green-400"
        style={{ overflow: 'visible' }}
      >
        {/* フォルダ本体（下部） */}
        <path
          d="M 4 16 L 4 40 L 44 40 L 44 16 Z"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* フォルダの蓋（アニメーション対象） */}
        <g ref={lidRef} style={{ transformOrigin: '24px 8px' }}>
          {/* 蓋の上部（タブ付き） */}
          <path
            d="M 4 8 L 4 16 L 44 16 L 44 8 L 26 8 L 22 4 L 4 4 Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  )
}
