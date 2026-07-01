'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  pageParamName?: string;
  className?: string;
}

export function Pagination({ 
  totalPages, 
  currentPage = 1, 
  pageParamName = 'page',
  className = '' 
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParamName, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Logic to show limited page numbers (e.g., 1, 2, 3, ..., 8, 9, 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1 mt-8 ${className}`}>
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous Page"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant/50 text-on-surface-variant/50 cursor-not-allowed">
          <ChevronLeft size={20} />
        </span>
      )}

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="flex items-center justify-center w-10 h-10 text-on-surface-variant">
              <MoreHorizontal size={20} />
            </span>
          );
        }

        const isCurrent = page === currentPage;
        
        return (
          <Link
            key={`page-${page}`}
            href={createPageUrl(page)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary font-medium text-sm
              ${isCurrent 
                ? 'bg-primary text-on-primary border-primary hover:bg-primary/90' 
                : 'border-outline-variant text-on-surface hover:bg-surface-container-high'
              }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next Page"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant/50 text-on-surface-variant/50 cursor-not-allowed">
          <ChevronRight size={20} />
        </span>
      )}
    </nav>
  );
}
