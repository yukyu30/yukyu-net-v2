'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ArticleActionsProps {
  title: string;
}

export default function ArticleActions({ title }: ArticleActionsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // GitHubの編集URLを生成
  const match = pathname.match(/^\/posts\/(.+)$/);
  const articleDir = match ? match[1] : null;
  const githubEditUrl = articleDir
    ? `https://github.com/yukyu30/public_articles/edit/main/${articleDir}/index.md`
    : null;

  const shareOnX = () => {
    const text = encodeURIComponent(title);
    const url = encodeURIComponent(currentUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('URLをコピーしました');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="border-2 border-black lg:border-2 border-x-0 lg:border-x-2">
      {/* Desktop Layout */}
      <div className="hidden sm:block">
        {/* Headers */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r-2 border-black py-1 text-center">
            <span className="text-xs font-mono uppercase tracking-widest">
              Edit
            </span>
          </div>
          <div className="py-1 text-center">
            <span className="text-xs font-mono uppercase tracking-widest">
              Share
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2">
          {/* GitHub edit button */}
          {githubEditUrl && (
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-r-2 border-black p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}

          {/* Share buttons */}
          <div className="grid grid-cols-2">
            {/* X button */}
            <button
              onClick={shareOnX}
              className="border-r border-black p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Share on X"
            >
              <span className="font-mono text-sm">𝕏</span>
            </button>

            {/* Link button */}
            <button
              onClick={copyToClipboard}
              className="p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Copy link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - 2 rows */}
      <div className="sm:hidden">
        {/* First Row - Edit */}
        <div className="border-b border-black">
          <div className="border-b border-black py-1 text-center">
            <span className="text-xs font-mono uppercase tracking-widest">
              Edit
            </span>
          </div>
          {githubEditUrl && (
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Second Row - Share */}
        <div>
          <div className="border-b border-black py-1 text-center">
            <span className="text-xs font-mono uppercase tracking-widest">
              Share
            </span>
          </div>
          <div className="grid grid-cols-2">
            {/* X button */}
            <button
              onClick={shareOnX}
              className="border-r border-black p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Share on X"
            >
              <span className="font-mono text-sm">𝕏</span>
            </button>

            {/* Link button */}
            <button
              onClick={copyToClipboard}
              className="p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Copy link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
