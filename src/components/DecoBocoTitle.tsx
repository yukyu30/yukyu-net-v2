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
    // シュッシュッとした緩急のある動き、一部は動かない
    chars.forEach((char) => {
      const rand = Math.random();
      const randomDelay = Math.random() * 0.3;

      if (rand < 0.3) {
        // 30%の確率で動かない
        return;
      } else if (rand < 0.65) {
        // 35%の確率で伸びた状態からスタートし、シュッと縮む
        gsap.set(char, { scaleY: 1.5 });
        gsap.to(char, {
          scaleY: 1,
          duration: 0.4,
          delay: randomDelay,
          ease: 'back.out(2)',
        });
      } else {
        // 35%の確率で通常状態からスタートし、シュッと伸びてシュッと戻る
        gsap.to(char, {
          scaleY: 1.5,
          yoyo: true,
          repeat: 1,
          duration: 0.3,
          delay: randomDelay,
          ease: 'power4.inOut',
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
