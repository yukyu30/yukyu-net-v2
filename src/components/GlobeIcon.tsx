'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GlobeIconProps {
  size?: number;
  className?: string;
}

export default function GlobeIcon({ size = 20, className = '' }: GlobeIconProps) {
  const containerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 経線グループ全体を連続的に左から右へ移動
      gsap.to(containerRef.current, {
        x: 18, // 1周期分移動
        duration: 4,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  // 経線を複数生成（ループ用に余分に作成）
  const meridians = [];
  for (let i = -3; i <= 3; i++) {
    const offset = i * 6;
    // 楕円の幅を位置に応じて計算（中央が広く、端が狭い）
    meridians.push(
      <ellipse
        key={i}
        cx={12 + offset}
        cy={12}
        rx={2.5}
        ry={9}
        strokeOpacity={0.6}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      {/* クリッピングマスク - 地球の外周 */}
      <defs>
        <clipPath id={`globeClip-${size}`}>
          <circle cx="12" cy="12" r="8.5" />
        </clipPath>
      </defs>

      {/* 外周の円 */}
      <circle cx="12" cy="12" r="9" />

      {/* 赤道 */}
      <ellipse cx="12" cy="12" rx="9" ry="2.5" />

      {/* 回転する経線グループ（クリッピング適用） */}
      <g clipPath={`url(#globeClip-${size})`}>
        <g ref={containerRef} style={{ transform: 'translateX(-18px)' }}>
          {meridians}
        </g>
      </g>
    </svg>
  );
}
