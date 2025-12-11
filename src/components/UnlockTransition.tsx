'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface UnlockTransitionProps {
  href: string;
  onComplete?: () => void;
}

export default function UnlockTransition({ href, onComplete }: UnlockTransitionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const lockBodyRef = useRef<SVGRectElement>(null);
  const shackleRef = useRef<SVGPathElement>(null);
  const [phase, setPhase] = useState<'lock' | 'unlock' | 'open'>('lock');

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // フェーズ1: ロック表示
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.1,
    });

    // フェーズ2: 振動（キーを入れる感じ）
    tl.to(lockBodyRef.current, {
      x: -2,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: 'none',
    });

    // フェーズ3: アンロック（シャックルが上がる）
    tl.to(shackleRef.current, {
      y: -8,
      rotation: 15,
      transformOrigin: 'right bottom',
      duration: 0.2,
      ease: 'power2.out',
      onStart: () => setPhase('unlock'),
    });

    // フェーズ4: 開く
    tl.to(shackleRef.current, {
      rotation: 45,
      y: -12,
      duration: 0.15,
      ease: 'power2.out',
      onStart: () => setPhase('open'),
    });

    // フェーズ5: 消える
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.2,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        router.push(href);
        onComplete?.();
      },
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center opacity-0"
    >
      <div className="text-center">
        {/* 南京錠SVG */}
        <svg
          width="100"
          height="120"
          viewBox="-10 -20 100 130"
          className="mx-auto overflow-visible"
        >
          {/* シャックル（U字部分） */}
          <path
            ref={shackleRef}
            d="M 20 40 L 20 25 C 20 10, 60 10, 60 25 L 60 40"
            fill="none"
            stroke={phase === 'lock' ? '#666' : '#4ade80'}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* ロック本体 */}
          <rect
            ref={lockBodyRef}
            x="10"
            y="40"
            width="60"
            height="45"
            rx="4"
            fill={phase === 'lock' ? '#333' : '#22c55e'}
            stroke={phase === 'lock' ? '#666' : '#4ade80'}
            strokeWidth="2"
          />
          {/* 鍵穴 */}
          <circle
            cx="40"
            cy="58"
            r="6"
            fill={phase === 'lock' ? '#111' : '#166534'}
          />
          <rect
            x="37"
            y="58"
            width="6"
            height="12"
            fill={phase === 'lock' ? '#111' : '#166534'}
          />
        </svg>

        {/* テキスト */}
        <div className="mt-6 font-mono text-sm text-green-400">
          {phase === 'lock' && 'ACCESSING...'}
          {phase === 'unlock' && 'UNLOCKING...'}
          {phase === 'open' && 'ACCESS GRANTED'}
        </div>
      </div>
    </div>
  );
}
