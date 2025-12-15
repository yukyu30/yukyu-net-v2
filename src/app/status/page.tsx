'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import MenuBar from '@/components/MenuBar';
import type { StatusResponse, Signal } from '@/types/status';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type FaceExpression = 'happy' | 'neutral' | 'sleepy' | 'excited';

function getFaceExpression(signal: Signal | undefined): FaceExpression {
  if (!signal) return 'neutral';

  const title = signal.title.toLowerCase();

  if (title.includes('朝') || title.includes('起') || title.includes('おはよう')) {
    return 'sleepy';
  }
  if (title.includes('嬉') || title.includes('楽') || title.includes('good') || title.includes('完了')) {
    return 'happy';
  }
  if (title.includes('!') || title.includes('！') || title.includes('やった')) {
    return 'excited';
  }

  return 'neutral';
}

interface DotFaceProps {
  expression: FaceExpression;
  isAlive: boolean;
}

function DotFace({ expression, isAlive }: DotFaceProps) {
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eyeRef.current || !isAlive) return;

    const blink = () => {
      if (eyeRef.current) {
        const eyes = eyeRef.current.querySelectorAll('.eye');
        gsap.to(eyes, {
          scaleY: 0.1,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        blink();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isAlive]);

  const baseColor = isAlive ? 'bg-green-400' : 'bg-red-500';
  const dimColor = isAlive ? 'bg-green-600' : 'bg-red-700';

  const getMouth = () => {
    switch (expression) {
      case 'happy':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="flex gap-0.5">
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            </div>
            <div className="flex gap-0.5 -mt-0.5">
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className="w-1 h-1" />
              <div className="w-1 h-1" />
              <div className="w-1 h-1" />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            </div>
          </div>
        );
      case 'excited':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="flex gap-0.5">
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            </div>
            <div className="flex gap-0.5">
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${dimColor} rounded-full`} />
              <div className={`w-1 h-1 ${dimColor} rounded-full`} />
              <div className={`w-1 h-1 ${dimColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            </div>
            <div className="flex gap-0.5 -mt-0.5">
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className="w-1 h-1" />
              <div className="w-1 h-1" />
              <div className="w-1 h-1" />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            </div>
          </div>
        );
      case 'sleepy':
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="flex gap-0.5">
              <div className="w-1 h-1" />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className={`w-1 h-1 ${baseColor} rounded-full`} />
              <div className="w-1 h-1" />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex gap-0.5 mt-1">
            <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            <div className={`w-1 h-1 ${baseColor} rounded-full`} />
          </div>
        );
    }
  };

  const getEyes = () => {
    if (expression === 'sleepy') {
      return (
        <div className="flex gap-4">
          <div className="flex gap-0.5">
            <div className={`eye w-1.5 h-0.5 ${baseColor} rounded-full`} />
          </div>
          <div className="flex gap-0.5">
            <div className={`eye w-1.5 h-0.5 ${baseColor} rounded-full`} />
          </div>
        </div>
      );
    }

    if (expression === 'excited') {
      return (
        <div className="flex gap-4">
          <div className="flex flex-col gap-0.5">
            <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            <div className={`eye w-2 h-2 ${baseColor} rounded-full`} />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className={`w-1 h-1 ${baseColor} rounded-full`} />
            <div className={`eye w-2 h-2 ${baseColor} rounded-full`} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        <div className={`eye w-2 h-2 ${baseColor} rounded-full`} />
        <div className={`eye w-2 h-2 ${baseColor} rounded-full`} />
      </div>
    );
  };

  return (
    <div ref={eyeRef} className="flex flex-col items-center p-4">
      {getEyes()}
      {getMouth()}
    </div>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, []);

  useEffect(() => {
    if (!heartRef.current || !status?.is_alive) return;

    const heart = heartRef.current;

    const heartbeat = gsap.timeline({ repeat: -1 });
    heartbeat
      .to(heart, { scale: 1.2, duration: 0.15, ease: 'power2.out' })
      .to(heart, { scale: 1, duration: 0.15, ease: 'power2.in' })
      .to(heart, { scale: 1.15, duration: 0.1, ease: 'power2.out' })
      .to(heart, { scale: 1, duration: 0.3, ease: 'power2.in' })
      .to(heart, { scale: 1, duration: 0.6 });

    return () => {
      heartbeat.kill();
    };
  }, [status?.is_alive]);

  const latestSignal = status?.recent_signals[0];
  const expression = getFaceExpression(latestSignal);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <MenuBar />

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="border-2 border-green-400 mb-4">
            <div className="border-b border-green-400 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-mono text-green-600">STATUS MONITOR</span>
              <Link
                href="/"
                className="text-sm font-mono text-green-600 hover:text-green-400"
              >
                [CLOSE]
              </Link>
            </div>

            {/* メインステータス */}
            <div className="p-8 flex flex-col items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="text-2xl font-mono text-green-600 animate-pulse">
                    CONNECTING...
                  </div>
                </div>
              ) : error ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    <span className="text-red-500">X</span>
                  </div>
                  <div className="text-2xl font-mono text-red-500">ERROR</div>
                  <div className="text-sm font-mono text-red-400 mt-2">{error}</div>
                </div>
              ) : status ? (
                <>
                  {/* ドットフェイス */}
                  <div className="mb-4 p-6 border border-green-800 rounded-lg">
                    <DotFace expression={expression} isAlive={status.is_alive} />
                  </div>

                  {/* ハートアイコン */}
                  <svg
                    ref={heartRef}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-12 h-12 mb-4 ${
                      status.is_alive ? 'text-green-400' : 'text-red-500'
                    }`}
                    style={{ transformOrigin: 'center' }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>

                  <div
                    className={`text-3xl font-mono font-bold ${
                      status.is_alive ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    {status.is_alive ? 'ALIVE' : 'OFFLINE'}
                  </div>
                  <div className="text-sm font-mono text-green-600 mt-2">
                    Last seen: {formatRelativeTime(status.last_seen_at)}
                  </div>
                  {latestSignal && (
                    <div className="text-xs font-mono text-green-600 mt-1">
                      &quot;{latestSignal.title}&quot;
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* 統計 */}
          {status && (
            <div className="border-2 border-green-400 mb-4">
              <div className="border-b border-green-400 px-4 py-2">
                <span className="text-sm font-mono text-green-600">STATISTICS</span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-green-800">
                <div className="p-4 text-center">
                  <div className="text-3xl font-mono text-green-400">
                    {status.signal_count}
                  </div>
                  <div className="text-xs font-mono text-green-600 mt-1">
                    TOTAL SIGNALS
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-sm font-mono text-green-400">
                    {formatDateTime(status.last_seen_at)}
                  </div>
                  <div className="text-xs font-mono text-green-600 mt-1">
                    LAST SIGNAL
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* シグナルタイムライン */}
          {status && status.recent_signals.length > 0 && (
            <div className="border-2 border-green-400">
              <div className="border-b border-green-400 px-4 py-2">
                <span className="text-sm font-mono text-green-600">
                  SIGNAL TIMELINE
                </span>
              </div>
              <div className="relative">
                {/* タイムラインの線 */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-green-800" />

                {status.recent_signals.map((signal, index) => (
                  <div
                    key={signal.id}
                    className="relative px-4 py-4 flex items-start gap-4"
                  >
                    {/* タイムラインのドット */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-green-400 animate-pulse' : 'bg-green-600'
                        }`}
                      />
                    </div>

                    {/* シグナル内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-sm font-mono text-green-400 truncate">
                          {signal.title}
                        </div>
                        <div className="text-xs font-mono text-green-600 flex-shrink-0">
                          {formatRelativeTime(signal.created_at)}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-green-700 mt-1">
                        {formatDateTime(signal.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-green-400 px-4 py-2 mt-4">
        <div className="text-center text-xs font-mono text-green-600">
          STATUS PAGE - DecoBoco Digital
        </div>
      </footer>
    </div>
  );
}
