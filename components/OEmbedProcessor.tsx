'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import OEmbedRenderer from './OEmbedRenderer';

interface OEmbedProcessorProps {
  html: string;
  className?: string;
}

export default function OEmbedProcessor({ html, className }: OEmbedProcessorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // HTMLを設定
    containerRef.current.innerHTML = html;

    // oEmbedプレースホルダーを探してReactコンポーネントに置換
    const placeholders = containerRef.current.querySelectorAll('[data-oembed-url]');
    
    placeholders.forEach((placeholder) => {
      const url = placeholder.getAttribute('data-oembed-url');
      if (!url) return;

      // プレースホルダーをコンテナで置換
      const embedContainer = document.createElement('div');
      embedContainer.className = 'oembed-embed my-6';
      placeholder.parentNode?.replaceChild(embedContainer, placeholder);

      // Reactコンポーネントをマウント
      const root = createRoot(embedContainer);
      root.render(<OEmbedRenderer url={url} />);
    });

    // クリーンアップ関数
    return () => {
      placeholders.forEach(() => {
        // Reactルートのアンマウントは自動的に行われる
      });
    };
  }, [html]);

  return <div ref={containerRef} className={className} />;
}