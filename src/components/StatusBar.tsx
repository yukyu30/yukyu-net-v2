'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
  const [uptime, setUptime] = useState<string>('00:00:00');
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memUsage, setMemUsage] = useState<number>(0);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // 時刻更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 稼働時間更新
  useEffect(() => {
    const updateUptime = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  // CPU/メモリ使用率をランダムに変動（OSが動いている感）
  useEffect(() => {
    const updateUsage = () => {
      setCpuUsage(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(5, Math.min(35, prev + change));
      });
      setMemUsage(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(20, Math.min(50, prev + change));
      });
    };

    setCpuUsage(15 + Math.random() * 10);
    setMemUsage(30 + Math.random() * 10);
    const interval = setInterval(updateUsage, 2000);
    return () => clearInterval(interval);
  }, []);

  // パルスアニメーション
  useEffect(() => {
    if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        opacity: 0.3,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  return (
    <div className="border-t border-green-400 bg-black px-4 py-2">
      <div className="flex items-center justify-between text-sm font-mono">
        {/* 左: ステータス + パルス */}
        <div className="flex items-center gap-3">
          <span
            ref={pulseRef}
            className="inline-block w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-green-400">{status}</span>
        </div>

        {/* 中央: システム情報 */}
        <div className="flex items-center gap-4 text-green-600">
          <span className="hidden sm:inline">
            CPU: {cpuUsage.toFixed(0)}%
          </span>
          <span className="hidden sm:inline">
            MEM: {memUsage.toFixed(0)}%
          </span>
          {postsCount !== undefined && (
            <span>ENTRIES: {postsCount}</span>
          )}
          <span className="hidden md:inline">
            UPTIME: {uptime}
          </span>
        </div>

        {/* 右: 時刻 */}
        <div className="text-green-400">
          {currentTime}
        </div>
      </div>
    </div>
  );
}
