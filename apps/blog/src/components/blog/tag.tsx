import Link from 'next/link';
import { Tag as TagType } from '@/lib/api';
import { cn, getContrastColor } from '@/lib/utils';

interface TagProps {
  tag: TagType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined' | 'ghost';
  asLink?: boolean;
}

export function Tag({ 
  tag, 
  size = 'sm', 
  variant = 'ghost',
  asLink = true 
}: TagProps) {
  const baseClasses = cn(
    'inline-flex items-center gap-1 font-medium rounded-full transition-colors',
    {
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      'px-4 py-1.5 text-base': size === 'lg',
    }
  );

  const colorClasses = cn({
    // Filled variant
    'text-white bg-growi-lime': variant === 'filled',
    
    // Outlined variant
    'border border-growi-forest bg-transparent text-growi-forest': variant === 'outlined',
    
    // Ghost variant
    'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'ghost',
  });

  const content = (
    <>
      <span className="text-xs opacity-60">#</span>
      <span>{tag.name}</span>
      {tag.articlesCount !== undefined && (
        <span className="opacity-60 text-xs">({tag.articlesCount})</span>
      )}
    </>
  );

  const className = cn(baseClasses, colorClasses);

  if (asLink) {
    return (
      <Link
        href={`/blog?tags=${tag.slug}`}
        className={cn(className, 'hover:opacity-80')}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={className}>
      {content}
    </span>
  );
}