'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [expandedDots, setExpandedDots] = useState<'start' | 'end' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) return null;

  const getPagePath = (page: number) => {
    if (page === 1) return basePath;
    return `/page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = isMobile ? 5 : 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (isMobile && totalPages > maxVisible) {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = Math.min(maxVisible - 1, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisible + 2);
        endPage = totalPages;
      } else {
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
          className="flex-1 py-3 sm:py-4 border-r border-green-400 hover:bg-green-400 hover:text-black transition-colors font-bold text-center text-xs sm:text-sm"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <button
            key="dots1"
            onClick={() => setExpandedDots(expandedDots === 'start' ? null : 'start')}
            className="flex-1 py-3 sm:py-4 border-r border-green-400 text-center hover:bg-green-400/20 transition-colors cursor-pointer text-xs sm:text-sm font-bold"
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
          className={`flex-1 py-3 sm:py-4 ${!isLast ? 'border-r' : ''} border-green-400 transition-colors font-bold text-center text-xs sm:text-sm ${
            i === currentPage
              ? 'bg-green-400 text-black'
              : 'hover:bg-green-400 hover:text-black'
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
            onClick={() => setExpandedDots(expandedDots === 'end' ? null : 'end')}
            className="flex-1 py-3 sm:py-4 border-r border-green-400 text-center hover:bg-green-400/20 transition-colors cursor-pointer text-xs sm:text-sm font-bold"
          >
            ...
          </button>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPagePath(totalPages)}
          className={`flex-1 py-3 sm:py-4 ${hasNext ? 'border-r' : ''} border-green-400 hover:bg-green-400 hover:text-black transition-colors font-bold text-center text-xs sm:text-sm`}
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
      <div className="border-t border-green-400">
        <div className="flex font-mono text-xs sm:text-sm uppercase">
          {hiddenPages.map((page, index) => (
            <Link
              key={page}
              href={getPagePath(page)}
              className={`flex-1 py-3 sm:py-4 ${
                index < hiddenPages.length - 1 ? 'border-r' : ''
              } border-green-400 hover:bg-green-400 hover:text-black transition-colors font-bold text-center text-xs sm:text-sm ${
                page === currentPage ? 'bg-green-400 text-black' : ''
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
    <nav className="font-mono text-xs sm:text-sm uppercase px-4 py-2">
      <div className="flex border border-green-400">
        {currentPage > 1 && (
          <Link
            href={getPagePath(currentPage - 1)}
            className="flex-1 py-3 sm:py-4 border-r border-green-400 hover:bg-green-400 hover:text-black transition-colors font-bold text-center"
          >
            <span className="hidden sm:inline">&lt;- PREV</span>
            <span className="sm:hidden">&lt;-</span>
          </Link>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <Link
            href={getPagePath(currentPage + 1)}
            className="flex-1 py-3 sm:py-4 hover:bg-green-400 hover:text-black transition-colors font-bold text-center"
          >
            <span className="hidden sm:inline">NEXT -&gt;</span>
            <span className="sm:hidden">-&gt;</span>
          </Link>
        )}
      </div>
      {renderExpandedNumbers()}
    </nav>
  );
}
