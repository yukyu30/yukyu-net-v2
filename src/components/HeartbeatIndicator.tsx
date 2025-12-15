'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface HeartbeatIndicatorProps {
  isAlive: boolean | null;
  isLoading: boolean;
}

export function HeartbeatIndicator({ isAlive, isLoading }: HeartbeatIndicatorProps) {
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!heartRef.current || !isAlive) return;

    const heart = heartRef.current;

    const heartbeat = gsap.timeline({ repeat: -1 });
    heartbeat
      .to(heart, {
        scale: 1.3,
        duration: 0.15,
        ease: 'power2.out',
      })
      .to(heart, {
        scale: 1,
        duration: 0.15,
        ease: 'power2.in',
      })
      .to(heart, {
        scale: 1.2,
        duration: 0.1,
        ease: 'power2.out',
      })
      .to(heart, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.in',
      })
      .to(heart, {
        scale: 1,
        duration: 0.6,
      });

    return () => {
      heartbeat.kill();
    };
  }, [isAlive]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-green-600">...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        ref={heartRef}
        data-testid="heart-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-4 h-4 ${isAlive ? 'text-green-400' : 'text-red-500'}`}
        style={{ transformOrigin: 'center' }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className={`text-sm font-mono hidden sm:inline ${isAlive ? 'text-green-400' : 'text-red-500'}`}>
        {isAlive ? 'Alive' : 'Offline'}
      </span>
    </div>
  );
}
