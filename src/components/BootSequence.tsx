'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import GlobeIcon from './GlobeIcon'

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete,
        })
      },
    })

    // 地球アイコン登場
    tl.fromTo(
      globeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )

    // テキスト表示
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    // 少し待機
    tl.to({}, { duration: 0.8 })

    // 全体が消える
    tl.to([globeRef.current, textRef.current], {
      scale: 1.1,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    })

  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none bg-black"
    >
      <div ref={globeRef}>
        <GlobeIcon size={150} className="text-green-400" />
      </div>
      <div ref={textRef} className="mt-6 text-center">
        <p className="text-green-400 font-mono text-xl tracking-widest">
          BOOTING SYSTEM...
        </p>
      </div>
    </div>
  )
}
