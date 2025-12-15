'use client';

import type { StatusResponse } from '@/types/status';

interface LifeStatusProps {
  status: StatusResponse | null;
  isLoading: boolean;
  error: string | null;
}

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

export function LifeStatus({ status, isLoading, error }: LifeStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono text-green-600">
        <span className="animate-pulse">LOADING...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono text-red-500">
        <span>ERROR: {error}</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-sm font-mono">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            status.is_alive
              ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]'
              : 'bg-red-500'
          }`}
        />
        <span className={status.is_alive ? 'text-green-400' : 'text-red-500'}>
          {status.is_alive ? 'ALIVE' : 'OFFLINE'}
        </span>
      </div>
      <div className="text-green-600">
        SIGNALS: <span className="text-green-400">{status.signal_count}</span>
      </div>
      <div className="text-green-600">
        LAST SEEN: <span className="text-green-400">{formatRelativeTime(status.last_seen_at)}</span>
      </div>
    </div>
  );
}
