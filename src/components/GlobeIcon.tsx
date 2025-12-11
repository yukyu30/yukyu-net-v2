'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GlobeIconProps {
  size?: number;
  className?: string;
}

export default function GlobeIcon({ size = 16, className = '' }: GlobeIconProps) {
  const meridianRef = useRef<SVGEllipseElement>(null);
  const verticalRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // 経線の回転アニメーション（楕円の幅を変化させて回転を表現）
    if (meridianRef.current) {
      gsap.to(meridianRef.current, {
        attr: { rx: 7 },
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

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
      {/* 外周の円 */}
      <circle cx="12" cy="12" r="10" />

      {/* 水平線（赤道） */}
      <ellipse cx="12" cy="12" rx="10" ry="3" />

      {/* 垂直の経線（回転アニメーション） */}
      <ellipse
        ref={meridianRef}
        cx="12"
        cy="12"
        rx="3"
        ry="10"
      />

      {/* 中央の縦線 */}
      <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.5" />
    </svg>
  );
}
