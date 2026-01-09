'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  url: string;
  meta: {
    title?: string;
    tags?: string;
    date?: string;
  };
  excerpt?: string;
}

declare global {
  interface Window {
    pagefind?: {
      init: () => Promise<void>;
      search: (query: string) => Promise<{
        results: Array<{
          id: string;
          data: () => Promise<SearchResult>;
        }>;
      }>;
    };
  }
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindLoaded = useRef(false);

  const loadPagefind = useCallback(async () => {
    if (pagefindLoaded.current || typeof window === 'undefined') return;

    try {
      // ランタイムで動的インポート（ビルド時には解決されない）
      const pagefind = await new Function(
        'return import("/pagefind/pagefind.js")'
      )();
      await pagefind.init();
      window.pagefind = pagefind;
      pagefindLoaded.current = true;
    } catch (err) {
      console.error('Failed to load pagefind:', err);
    }
  }, []);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        if (!window.pagefind) {
          await loadPagefind();
        }

        if (window.pagefind) {
          const search = await window.pagefind.search(searchQuery);
          const resultsData = await Promise.all(
            search.results.slice(0, 10).map((r) => r.data())
          );
          setResults(resultsData);
        }
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [loadPagefind]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      loadPagefind();
    }
  }, [isOpen, loadPagefind]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-5 py-2 text-base font-mono uppercase transition-colors hover:bg-green-400 hover:text-black flex items-center gap-2"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">Search</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-2xl mx-4 bg-black border-2 border-green-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-2 border-green-400 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-mono">SEARCH</span>
              <button
                onClick={handleClose}
                className="text-green-400 hover:text-green-200"
                aria-label="Close"
              >
                <span className="font-mono">[ESC]</span>
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center border-2 border-green-400">
                <span className="px-3 text-green-400 font-mono">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="検索キーワードを入力..."
                  className="flex-1 bg-transparent px-2 py-3 font-mono text-green-400 placeholder-green-700 focus:outline-none"
                />
                {isLoading && (
                  <span className="px-3 text-green-400 font-mono animate-pulse">
                    ...
                  </span>
                )}
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto">
                {hasSearched && results.length === 0 && !isLoading && (
                  <p className="text-green-600 font-mono text-sm">
                    「{query}」は見つかりませんでした
                  </p>
                )}

                {results.map((result, index) => (
                  <div
                    key={result.url || index}
                    className="p-3 border-b border-green-800 hover:bg-green-900/30 transition-colors"
                  >
                    <Link
                      href={result.url}
                      onClick={handleClose}
                      className="block"
                    >
                      <h3 className="font-mono text-green-400 font-bold">
                        {result.meta?.title || 'Untitled'}
                      </h3>
                      {result.meta?.tags && (
                        <p className="text-xs font-mono text-green-600 mt-1">
                          TAGS: {result.meta.tags}
                        </p>
                      )}
                      {result.excerpt && (
                        <p
                          className="text-sm font-mono text-green-500 mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      )}
                    </Link>
                    <Link
                      href={`/chat?q=${encodeURIComponent(result.meta?.title || '')}`}
                      onClick={handleClose}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-green-600 hover:text-green-400 transition-colors"
                    >
                      <span>▛</span>
                      <span>この記事についてChatで話す</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-green-800">
                <p className="text-xs font-mono text-green-700">
                  TIP: Cmd/Ctrl + K でいつでも検索
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
