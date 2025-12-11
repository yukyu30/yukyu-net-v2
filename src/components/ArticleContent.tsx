'use client';

import { useEffect, useRef, useState } from 'react';

interface ArticleContentProps {
  content: string;
  charsPerSecond?: number; // 1秒あたりに復号する文字数
}

// 文字化け用のランダム文字
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン゛゜';

function getRandomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function ArticleContent({
  content,
  charsPerSecond = 100, // デフォルト: 1秒あたり100文字復号
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
    const msPerChar = 1000 / charsPerSecond; // 1文字あたりのミリ秒

    // 各文字のアニメーション（先頭から順番に復号）
    charData.forEach((data, charIndex) => {
      // 先頭から順番に復号されるように、インデックスに基づいて時間を計算
      const baseRevealTime = charIndex * msPerChar;
      // 少しランダム性を加えて自然な感じに
      const randomOffset = (Math.random() - 0.5) * msPerChar * 2;
      const revealTime = Math.max(0, baseRevealTime + randomOffset);

      const glitchCount = Math.floor(Math.random() * 3) + 2;
      const glitchInterval = Math.min(revealTime / glitchCount, 50);

      // 文字化けアニメーション
      for (let i = 0; i < glitchCount; i++) {
        const glitchTime = revealTime - (glitchCount - i) * glitchInterval;
        if (glitchTime > 0) {
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
    const totalDuration = charData.length * msPerChar + 500;
    timeouts.push(
      setTimeout(() => {
        setIsRevealed(true);
      }, totalDuration)
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [content, charsPerSecond, isRevealed]);

  return (
    <div
      ref={containerRef}
      className="article-content max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
