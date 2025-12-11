'use client';

import { useState, useEffect, ReactNode } from 'react';

interface BootSequenceProps {
  children: ReactNode;
}

const BOOT_MESSAGES = [
  { text: 'DecoBocoDigital OS v2.0.25', delay: 0 },
  { text: 'INITIALIZING SYSTEM...', delay: 200 },
  { text: 'LOADING KERNEL.............. OK', delay: 400 },
  { text: 'MOUNTING FILESYSTEM......... OK', delay: 600 },
  { text: 'CHECKING MEMORY............. 64KB OK', delay: 800 },
  { text: 'LOADING MODULES:', delay: 1000 },
  { text: '  - typography.mod.......... OK', delay: 1100 },
  { text: '  - grid.mod................ OK', delay: 1200 },
  { text: '  - animation.mod........... OK', delay: 1300 },
  { text: 'ESTABLISHING CONNECTION..... OK', delay: 1500 },
  { text: 'SYSTEM READY', delay: 1800 },
  { text: '', delay: 2000 },
  { text: 'Welcome to DecoBocoDigital', delay: 2200 },
];

const TOTAL_BOOT_TIME = 3000;

export default function BootSequence({ children }: BootSequenceProps) {
  const [isBooted, setIsBooted] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // セッション中に既に起動済みかチェック
    const hasBooted = sessionStorage.getItem('decoboco-booted');
    if (hasBooted) {
      setIsBooted(true);
      return;
    }

    // 各行を順番に表示
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_MESSAGES.forEach((msg, index) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, msg.delay)
      );
    });

    // 起動完了
    timeouts.push(
      setTimeout(() => {
        setIsBooted(true);
        sessionStorage.setItem('decoboco-booted', 'true');
      }, TOTAL_BOOT_TIME)
    );

    // カーソル点滅
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      clearInterval(cursorInterval);
    };
  }, []);

  if (isBooted) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono text-sm p-8 z-50 overflow-hidden">
      <div className="max-w-2xl">
        {/* ヘッダー */}
        <div className="border border-green-400 p-4 mb-6">
          <div className="text-center text-lg font-bold tracking-wider">
            DecoBocoDigital OS
          </div>
          <div className="text-center text-xs mt-1 text-green-600">
            PERSONAL COMPUTING SYSTEM
          </div>
        </div>

        {/* ブートログ */}
        <div className="space-y-1">
          {BOOT_MESSAGES.map((msg, index) => (
            <div
              key={index}
              className={`transition-opacity duration-100 ${
                visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* カーソル */}
        <div className="mt-4">
          <span
            className={`inline-block w-2 h-4 bg-green-400 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* プログレスバー */}
        <div className="mt-8 border border-green-400 p-1">
          <div
            className="h-2 bg-green-400 transition-all duration-100"
            style={{
              width: `${(visibleLines.length / BOOT_MESSAGES.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
