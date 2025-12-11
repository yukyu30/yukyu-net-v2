import { ReactNode } from 'react';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function WindowFrame({ title, children, className = '' }: WindowFrameProps) {
  return (
    <div className={`border border-green-400 bg-black ${className}`}>
      {/* タイトルバー */}
      <div className="flex items-center justify-between border-b border-green-400 px-2 py-1 bg-green-400/10">
        {/* ウィンドウボタン */}
        <div className="flex gap-1">
          <button className="w-4 h-4 border border-green-400 text-green-400 text-xs font-mono flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors">
            -
          </button>
          <button className="w-4 h-4 border border-green-400 text-green-400 text-xs font-mono flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors">
            +
          </button>
          <button className="w-4 h-4 border border-green-400 text-green-400 text-xs font-mono flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors">
            x
          </button>
        </div>
        {/* タイトル */}
        <span className="text-xs font-mono font-bold uppercase tracking-wide">
          {title}
        </span>
        {/* スペーサー */}
        <div className="w-16" />
      </div>
      {/* コンテンツ */}
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}
