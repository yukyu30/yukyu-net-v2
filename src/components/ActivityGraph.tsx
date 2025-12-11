'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ActivityGraphProps {
  className?: string;
  barCount?: number;
  height?: number;
}

export default function ActivityGraph({
  className = '',
  barCount = 8,
  height = 16
}: ActivityGraphProps) {
  const barsRef = useRef<(SVGRectElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // バーのアニメーション
    const animateBars = () => {
      barsRef.current.forEach((bar) => {
        if (bar) {
          const newHeight = 20 + Math.random() * 60;
          gsap.to(bar, {
            attr: {
              height: newHeight,
              y: height - newHeight
            },
            duration: 0.3 + Math.random() * 0.3,
            ease: 'power2.out'
          });
        }
      });
    };

    // 定期的に更新
    const interval = setInterval(animateBars, 800);
    animateBars(); // 初回実行

    return () => clearInterval(interval);
  }, [barCount, height]);

  const barWidth = 2;
  const gap = 2;
  const totalWidth = barCount * barWidth + (barCount - 1) * gap;

  // SSR時は固定値でレンダリング
  const initialHeight = height * 0.5;

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      className={className}
    >
      {Array(barCount).fill(0).map((_, index) => (
        <rect
          key={index}
          ref={(el) => { barsRef.current[index] = el; }}
          x={index * (barWidth + gap)}
          y={height - initialHeight}
          width={barWidth}
          height={initialHeight}
          fill="currentColor"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}
