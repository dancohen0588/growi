import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/api';
import { CategoryBadge } from './category-badge';
import { Tag } from './tag';
import { formatDate, formatReadingTime } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'compact' | 'full';
}

export function ArticleCard({ article, variant = 'compact' }: ArticleCardProps) {
  const isCompact = variant === 'compact';

  return (
    <article className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-growi-lime ${isCompact ? 'h-full' : ''}`}>
      {/* Hero Image */}
      {article.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
          
          {/* Category badge overlay */}
          <div className="absolute top-4 left-4">
            <CategoryBadge category={article.category} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            {article.author.avatar && (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{article.author.name}</span>
          </div>
          
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          )}
          
          {article.readingTime && (
            <span className="flex items-center gap-1">
              <span>📖</span>
              {formatReadingTime(article.readingTime)}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={`font-bold text-growi-forest font-poppins mb-3 group-hover:text-growi-lime transition-colors ${isCompact ? 'text-lg line-clamp-2' : 'text-xl'}`}>
          <Link href={`/blog/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h2>

        {/* Subtitle */}
        {article.excerpt && (
          <p className={`text-gray-600 mb-3 ${isCompact ? 'text-sm line-clamp-2' : ''}`}>
            {article.excerpt}
          </p>
        )}

        {/* Excerpt */}
        {article.excerpt && !isCompact && (
          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, isCompact ? 2 : 4).map((tag) => (
              <Tag key={tag.id} tag={tag} size="sm" />
            ))}
            {article.tags.length > (isCompact ? 2 : 4) && (
              <span className="text-xs text-gray-400">
                +{article.tags.length - (isCompact ? 2 : 4)}
              </span>
            )}
          </div>
        )}

        {/* Subcategory */}
        {article.category && (
          <div className="text-xs text-growi-forest font-medium mb-3">
            {article.category.name}
          </div>
        )}

        {/* Read more link */}
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-2 text-growi-forest hover:text-growi-lime font-medium transition-colors group/link"
          >
            Lire l'article
            <svg 
              className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {/* View count */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>👁️</span>
            <span>{article.views}</span>
          </div>
        </div>
      </div>
    </article>
  );
}