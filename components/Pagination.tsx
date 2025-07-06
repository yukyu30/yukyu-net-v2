import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = '' }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const getPageUrl = (page: number) => {
    if (page === 1) return basePath || '/';
    return `${basePath || ''}/page/${page}`;
  };

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          前へ
        </Link>
      )}
      
      <div className="flex space-x-1">
        {pages.map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 2 && page <= currentPage + 2)
          ) {
            return (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {page}
              </Link>
            );
          } else if (
            page === currentPage - 3 ||
            page === currentPage + 3
          ) {
            return (
              <span key={page} className="px-2 py-2">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          次へ
        </Link>
      )}
    </nav>
  );
}