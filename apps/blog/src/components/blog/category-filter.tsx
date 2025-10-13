'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Category } from '@/lib/api';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
  activeSubcategory?: string;
}

export function CategoryFilter({ 
  categories, 
  activeCategory, 
  activeSubcategory 
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(activeCategory ? [activeCategory] : [])
  );
  const searchParams = useSearchParams();

  const toggleCategory = (categorySlug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
  };

  const buildUrl = (params: { category?: string; subcategory?: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (params.category) {
      newSearchParams.set('category', params.category);
    } else {
      newSearchParams.delete('category');
    }
    
    if (params.subcategory) {
      newSearchParams.set('subcategory', params.subcategory);
    } else {
      newSearchParams.delete('subcategory');
    }
    
    // Reset page when filtering
    newSearchParams.delete('page');
    
    const queryString = newSearchParams.toString();
    return `/blog${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <Link
          href="/blog"
          className={cn(
            'block px-3 py-2 rounded-lg font-medium transition-colors',
            !activeCategory 
              ? 'bg-growi-lime text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          📝 Tous les articles
        </Link>
      </div>

      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.slug);
        const isActive = activeCategory === category.slug;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        return (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center">
              <Link
                href={buildUrl({ category: category.slug })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                  isActive && !activeSubcategory
                    ? 'bg-growi-lime text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {category.icon && (
                  <span role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                )}
                <span>{category.name}</span>
                {category.articleCount !== undefined && (
                  <span className="text-xs opacity-60">
                    ({category.articleCount})
                  </span>
                )}
              </Link>
              
              {hasSubcategories && (
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className="p-1 ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isExpanded ? 'Réduire' : 'Développer'}
                >
                  <svg 
                    className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {hasSubcategories && isExpanded && (
              <div className="ml-6 space-y-1">
                {category.subcategories!.map((subcategory) => {
                  const isSubActive = activeCategory === category.slug && 
                                     activeSubcategory === subcategory.slug;

                  return (
                    <Link
                      key={subcategory.id}
                      href={buildUrl({ 
                        category: category.slug, 
                        subcategory: subcategory.slug 
                      })}
                      className={cn(
                        'block px-3 py-1.5 rounded-lg text-sm transition-colors',
                        isSubActive
                          ? 'bg-growi-lime text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {subcategory.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}