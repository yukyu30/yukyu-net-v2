'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StaggerRevealProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export default function StaggerReveal({
  children,
  index,
  className = '',
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    // 初期状態: 非表示
    gsap.set(ref.current, {
      opacity: 0,
      y: 20,
      scale: 0.98,
    });

    // キビキビとしたステップアニメーション
    // 各要素は50ms間隔で順番に表示
    const delay = index * 0.05;

    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      delay: delay,
      ease: 'power4.out',
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
