'use client';

import { useEffect, useRef, useState } from 'react';

interface ArticleContentProps {
  content: string;
  duration?: number;
}

// 文字化け用のランダム文字
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン゛゜';

function getRandomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function ArticleContent({
  content,
  duration = 2000,
}: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isRevealed) return;

    const container = containerRef.current;

    // テキストノードを収集
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.trim()) {
        textNodes.push(node as Text);
      }
    }

    // 各テキストノードの元のテキストと文字位置を保存
    const originalTexts = textNodes.map((node) => node.textContent || '');
    const charData: { node: Text; index: number; original: string; revealed: boolean }[] = [];

    textNodes.forEach((node, nodeIndex) => {
      const text = originalTexts[nodeIndex];
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ' && text[i] !== '\n' && text[i] !== '\t') {
          charData.push({
            node,
            index: i,
            original: text[i],
            revealed: false,
          });
        }
      }
    });

    // 初期状態: 文字化け
    textNodes.forEach((node, nodeIndex) => {
      const text = originalTexts[nodeIndex];
      let glitched = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ' || text[i] === '\n' || text[i] === '\t') {
          glitched += text[i];
        } else {
          glitched += getRandomChar();
        }
      }
      node.textContent = glitched;
    });

    const timeouts: NodeJS.Timeout[] = [];

    // 各文字のアニメーション
    charData.forEach((data) => {
      const revealTime = Math.random() * duration * 0.8 + duration * 0.1;
      const glitchCount = Math.floor(Math.random() * 4) + 2;

      // 文字化けアニメーション
      for (let i = 0; i < glitchCount; i++) {
        const glitchTime = (revealTime / glitchCount) * i;
        timeouts.push(
          setTimeout(() => {
            if (!data.revealed && data.node.textContent) {
              const chars = data.node.textContent.split('');
              chars[data.index] = getRandomChar();
              data.node.textContent = chars.join('');
            }
          }, glitchTime)
        );
      }

      // 正しい文字を表示
      timeouts.push(
        setTimeout(() => {
          data.revealed = true;
          if (data.node.textContent) {
            const chars = data.node.textContent.split('');
            chars[data.index] = data.original;
            data.node.textContent = chars.join('');
          }
        }, revealTime)
      );
    });

    // アニメーション完了後
    timeouts.push(
      setTimeout(() => {
        setIsRevealed(true);
      }, duration)
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [content, duration, isRevealed]);

  return (
    <div
      ref={containerRef}
      className="article-content max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
