import { ReactNode } from 'react';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function WindowFrame({ title, children, className = '' }: WindowFrameProps) {
  return (
    <div className={`border border-green-600 bg-black ${className}`}>
      {/* タイトルバー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-800">
        <div className="flex gap-2 text-green-600">
          <span className="text-sm font-mono">[-]</span>
          <span className="text-sm font-mono">[+]</span>
          <span className="text-sm font-mono">[x]</span>
        </div>
        <span className="text-sm font-mono font-bold uppercase tracking-wide">
          {title}
        </span>
        <div className="w-20" />
      </div>
      {/* コンテンツ */}
      {children}
    </div>
  );
}
