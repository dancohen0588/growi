'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl = '/blog',
  searchParams = {}
}: PaginationProps) {
  const urlSearchParams = useSearchParams();
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing search params except page
    for (const [key, value] of urlSearchParams.entries()) {
      if (key !== 'page') {
        params.set(key, value);
      }
    }
    
    // Add new page if not first page
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex justify-center items-center space-x-1" aria-label="Pagination">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-growi-forest transition-colors"
          aria-label="Page précédente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm font-medium text-gray-400">
                ...
              </span>
            ) : (
              <Link
                href={buildUrl(page as number)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-growi-lime text-white'
                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-growi-forest'
                )}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-growi-forest transition-colors"
          aria-label="Page suivante"
        >
          Suivant
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
          Suivant
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}