'use client';

import { useState, useEffect } from 'react';

interface StatusBarProps {
  postsCount?: number;
  lastUpdate?: string;
  status?: string;
}

export default function StatusBar({
  postsCount,
  lastUpdate,
  status = 'READY'
}: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-green-400 bg-black px-2 py-1">
      <div className="flex items-center justify-between text-xs font-mono">
        {/* 左: ステータス */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">{status}</span>
        </div>

        {/* 中央: 情報 */}
        <div className="flex items-center gap-4">
          {postsCount !== undefined && (
            <span className="text-green-600">ENTRIES: {postsCount}</span>
          )}
          {lastUpdate && (
            <span className="text-green-600">LAST: {lastUpdate}</span>
          )}
        </div>

        {/* 右: 時刻 */}
        <div className="text-green-400">
          {currentTime}
        </div>
      </div>
    </div>
  );
}
