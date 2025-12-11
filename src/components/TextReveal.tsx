'use client';

import { useState, useEffect, useRef } from 'react';

interface TextRevealProps {
  text: string;
  duration?: number; // 全体のアニメーション時間（ms）
  className?: string;
}

// 文字化け用のランダム文字
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン゛゜';

function getRandomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function TextReveal({
  text,
  duration = 2000,
  className = '',
}: TextRevealProps) {
  const [displayChars, setDisplayChars] = useState<string[]>(() =>
    text.split('').map((char) => (char === ' ' ? ' ' : getRandomChar()))
  );
  const revealedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const chars = text.split('');
    const nonSpaceIndices = chars
      .map((char, index) => (char !== ' ' ? index : -1))
      .filter((index) => index !== -1);

    const timeouts: NodeJS.Timeout[] = [];

    nonSpaceIndices.forEach((index) => {
      // 文字化けを数回繰り返してから正しい文字を表示
      const revealTime = Math.random() * duration * 0.8 + duration * 0.1;
      const glitchCount = Math.floor(Math.random() * 5) + 3;

      // 文字化けアニメーション
      for (let i = 0; i < glitchCount; i++) {
        const glitchTime = (revealTime / glitchCount) * i;
        timeouts.push(
          setTimeout(() => {
            if (!revealedRef.current.has(index)) {
              setDisplayChars((prev) => {
                const newChars = [...prev];
                newChars[index] = getRandomChar();
                return newChars;
              });
            }
          }, glitchTime)
        );
      }

      // 正しい文字を表示
      timeouts.push(
        setTimeout(() => {
          revealedRef.current.add(index);
          setDisplayChars((prev) => {
            const newChars = [...prev];
            newChars[index] = text[index];
            return newChars;
          });
        }, revealTime)
      );
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [text, duration]);

  return (
    <span className={className}>
      {displayChars.map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
