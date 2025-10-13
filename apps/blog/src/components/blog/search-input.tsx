'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  initialValue = '', 
  placeholder = 'Rechercher...', 
  className 
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (searchQuery: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      } else {
        params.delete('q');
      }
      
      // Reset page when searching
      params.delete('page');
      
      const queryString = params.toString();
      router.push(`/blog${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-2 pl-10 pr-10 text-sm border border-gray-200 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-growi-lime focus:border-transparent',
            'placeholder:text-gray-400',
            isPending && 'opacity-50'
          )}
          disabled={isPending}
        />
        
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Effacer la recherche"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading indicator */}
        {isPending && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-growi-lime rounded-full"></div>
          </div>
        )}
      </div>

      {/* Hidden submit button for form accessibility */}
      <button type="submit" className="sr-only">
        Rechercher
      </button>
    </form>
  );
}