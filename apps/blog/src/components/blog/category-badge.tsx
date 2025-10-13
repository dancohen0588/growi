import Link from 'next/link';
import { Category } from '@/lib/api';
import { cn, getContrastColor } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
  asLink?: boolean;
}

export function CategoryBadge({ 
  category, 
  size = 'md', 
  variant = 'filled',
  asLink = true 
}: CategoryBadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center gap-1 font-medium rounded-full transition-colors',
    {
      'px-2 py-1 text-xs': size === 'sm',
      'px-3 py-1.5 text-sm': size === 'md',
      'px-4 py-2 text-base': size === 'lg',
    }
  );

  const colorClasses = cn({
    // Filled variant - utilise la couleur de la category ou growi-lime par défaut
    'text-white': variant === 'filled',
    'bg-growi-lime': variant === 'filled',
    
    // Outlined variant
    'border border-growi-forest bg-transparent text-growi-forest': variant === 'outlined',
  });

  // Style dynamique basé sur la couleur de la category
  const style = category.color && variant === 'filled'
    ? { backgroundColor: category.color, color: getContrastColor(category.color) === 'white' ? '#ffffff' : '#000000' }
    : category.color && variant === 'outlined'
    ? { color: category.color, borderColor: category.color }
    : {};

  const content = (
    <>
      <span>{category.name}</span>
      {category.articlesCount !== undefined && (
        <span className="opacity-75">({category.articlesCount})</span>
      )}
    </>
  );

  const className = cn(baseClasses, colorClasses);

  if (asLink) {
    return (
      <Link 
        href={`/blog?category=${category.slug}`}
        className={cn(className, 'hover:opacity-80')}
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={className} style={style}>
      {content}
    </span>
  );
}