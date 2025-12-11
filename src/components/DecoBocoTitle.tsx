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

    // 凸凹アニメーション：一度伸びてから元に戻る
    gsap.to(chars, {
      scaleY: 1.4,
      yoyo: true,
      repeat: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: {
        each: 0.08,
      },
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
