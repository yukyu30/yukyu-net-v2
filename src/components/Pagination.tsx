'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const [expandedDots, setExpandedDots] = useState<'start' | 'end' | null>(
    null
  );

  if (totalPages <= 1) return null;

  const getPagePath = (page: number) => {
    if (page === 1) return basePath;
    return `/page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    // モバイルでは表示数を制限
    const isMobile =
      typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    const maxVisible = isMobile ? 5 : 7;

    // 現在のページを中心に表示
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // ページ数が少ない場合の調整
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // モバイルで最初と最後のページを常に表示する場合の調整
    if (isMobile && totalPages > maxVisible) {
      // 現在のページが最初の方の場合
      if (currentPage <= 3) {
        startPage = 1;
        endPage = Math.min(maxVisible - 1, totalPages - 1);
      }
      // 現在のページが最後の方の場合
      else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisible + 2);
        endPage = totalPages;
      }
      // 中間の場合
      else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    const hasNext = currentPage < totalPages;

    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={getPagePath(1)}
          className="flex-1 py-3 sm:py-4 border-r-2 border-black hover:bg-black hover:text-white transition-colors font-bold text-center text-xs sm:text-sm"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <button
            key="dots1"
            onClick={() =>
              setExpandedDots(expandedDots === 'start' ? null : 'start')
            }
            className="flex-1 py-3 sm:py-4 border-r-2 border-black text-center hover:bg-gray-100 transition-colors cursor-pointer text-xs sm:text-sm font-bold"
          >
            ...
          </button>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isLast = i === endPage && endPage === totalPages && !hasNext;
      pages.push(
        <Link
          key={i}
          href={getPagePath(i)}
          className={`flex-1 py-3 sm:py-4 ${
            !isLast ? 'border-r-2' : ''
          } border-black transition-colors font-bold text-center text-xs sm:text-sm ${
            i === currentPage
              ? 'bg-black text-white'
              : 'hover:bg-black hover:text-white'
          }`}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <button
            key="dots2"
            onClick={() =>
              setExpandedDots(expandedDots === 'end' ? null : 'end')
            }
            className="flex-1 py-3 sm:py-4 border-r-2 border-black text-center hover:bg-gray-100 transition-colors cursor-pointer text-xs sm:text-sm font-bold"
          >
            ...
          </button>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPagePath(totalPages)}
          className={`flex-1 py-3 sm:py-4 ${
            hasNext ? 'border-r-2' : ''
          } border-black hover:bg-black hover:text-white transition-colors font-bold text-center text-xs sm:text-sm`}
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  const renderExpandedNumbers = () => {
    if (!expandedDots) return null;

    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    let hiddenPages: number[] = [];

    if (expandedDots === 'start' && startPage > 2) {
      for (let i = 2; i < startPage; i++) {
        hiddenPages.push(i);
      }
    } else if (expandedDots === 'end' && endPage < totalPages - 1) {
      for (let i = endPage + 1; i < totalPages; i++) {
        hiddenPages.push(i);
      }
    }

    if (hiddenPages.length === 0) return null;

    return (
      <div className="border-t-2 border-black">
        <div className="flex font-mono text-xs sm:text-sm uppercase">
          {hiddenPages.map((page, index) => (
            <Link
              key={page}
              href={getPagePath(page)}
              className={`flex-1 py-3 sm:py-4 ${
                index < hiddenPages.length - 1 ? 'border-r-2' : ''
              } border-black hover:bg-black hover:text-white transition-colors font-bold text-center text-xs sm:text-sm ${
                page === currentPage ? 'bg-black text-white' : ''
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="border-t-2 border-black">
      <div className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <nav className="flex font-mono text-xs sm:text-sm uppercase border-black">
            {currentPage > 1 && (
              <Link
                href={getPagePath(currentPage - 1)}
                className="flex-1 py-3 sm:py-4 border-r-2 border-black hover:bg-black hover:text-white transition-colors font-bold text-center"
              >
                <span className="hidden sm:inline">← Prev</span>
                <span className="sm:hidden">←</span>
              </Link>
            )}

            {renderPageNumbers()}

            {currentPage < totalPages && (
              <Link
                href={getPagePath(currentPage + 1)}
                className="flex-1 py-3 sm:py-4 hover:bg-black hover:text-white transition-colors font-bold text-center"
              >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden">→</span>
              </Link>
            )}
          </nav>
          {renderExpandedNumbers()}
        </div>
      </div>
    </section>
  );
}
