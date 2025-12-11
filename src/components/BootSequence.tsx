'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import GlobeIcon from './GlobeIcon'

interface BootSequenceProps {
  onComplete: () => void
}

const BOOT_MESSAGES = [
  { text: 'DecoBocoDigital OS v2.0.25', delay: 0 },
  { text: 'INITIALIZING SYSTEM...', delay: 200 },
  { text: 'LOADING KERNEL.............. OK', delay: 400 },
  { text: 'MOUNTING FILESYSTEM......... OK', delay: 600 },
  { text: 'CHECKING MEMORY............. 64KB OK', delay: 800 },
  { text: 'LOADING MODULES:', delay: 1000 },
  { text: '  - typography.mod.......... OK', delay: 1100 },
  { text: '  - grid.mod................ OK', delay: 1200 },
  { text: '  - animation.mod........... OK', delay: 1300 },
  { text: 'ESTABLISHING CONNECTION..... OK', delay: 1500 },
  { text: 'SYSTEM READY', delay: 1800 },
]

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // 地球アイコン登場
    gsap.fromTo(
      globeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )

    // 各行を順番に表示
    BOOT_MESSAGES.forEach((msg, index) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index])
        }, msg.delay)
      )
    })

    // カーソル点滅
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    // 起動完了後フェードアウト
    timeouts.push(
      setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete,
        })
      }, 2500)
    )

    return () => {
      timeouts.forEach((t) => clearTimeout(t))
      clearInterval(cursorInterval)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center">
        {/* 地球アイコン */}
        <div ref={globeRef} className="mb-8">
          <GlobeIcon size={120} className="text-green-400" />
        </div>

        {/* ブートログ */}
        <div ref={logRef} className="font-mono text-xs text-green-400 space-y-0.5 max-w-md">
          {BOOT_MESSAGES.map((msg, index) => (
            <div
              key={index}
              className={`transition-opacity duration-100 ${
                visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ letterSpacing: '0.05em' }}
            >
              {msg.text}
            </div>
          ))}
          {/* カーソル */}
          <span
            className={`inline-block w-2 h-3 bg-green-400 mt-1 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
