'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface DecoBocoTitleProps {
  text: string;
}

export default function DecoBocoTitle({ text }: DecoBocoTitleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('[data-char]');

    // 各文字にランダムな初期状態と遅延でアニメーション
    chars.forEach((char) => {
      const startExpanded = Math.random() > 0.5;
      const randomDelay = Math.random() * 0.5;

      if (startExpanded) {
        // 最初から伸びた状態でスタートし、縮む
        gsap.set(char, { scaleY: 1.4 });
        gsap.to(char, {
          scaleY: 1,
          duration: 0.8,
          delay: randomDelay,
          ease: 'power2.inOut',
        });
      } else {
        // 通常状態からスタートし、伸びてから戻る
        gsap.to(char, {
          scaleY: 1.4,
          yoyo: true,
          repeat: 1,
          duration: 0.8,
          delay: randomDelay,
          ease: 'power2.inOut',
        });
      }
    });
  }, { scope: containerRef });

  return (
    <span ref={containerRef}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          data-char={char}
          style={{ display: 'inline-block', transformOrigin: 'center bottom' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
