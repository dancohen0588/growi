import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

const cardVariants = {
  variant: {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    bordered: 'bg-white border border-growi-sand',
  },
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
}

export function Card({ 
  children, 
  className,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  return (
    <div className={cn(
      'rounded-xl transition-shadow',
      cardVariants.variant[variant],
      cardVariants.padding[padding],
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('pt-0', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center pt-0', className)}>
      {children}
    </div>
  )
}

// Article Card - composant spécialisé pour les articles de blog
interface ArticleCardProps {
  title: string
  excerpt: string
  imageUrl?: string
  category: string
  readingTime: string
  href: string
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  imageUrl,
  category,
  readingTime,
  href,
  className
}: ArticleCardProps) {
  return (
    <Card variant="elevated" padding="none" className={cn('overflow-hidden group cursor-pointer', className)}>
      <a href={href} className="block">
        {/* Image */}
        <div className="aspect-video bg-growi-sand/20 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-growi-forest/40">
              <span className="text-6xl">🌱</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <CardHeader className="mb-3">
            <h3 className="font-semibold text-growi-forest font-poppins text-lg group-hover:text-growi-lime transition-colors line-clamp-2">
              {title}
            </h3>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {excerpt}
            </p>
          </CardContent>
          
          <CardFooter className="justify-between text-sm text-gray-500">
            <span>{readingTime}</span>
            <span className="bg-growi-lime/20 text-growi-forest px-2 py-1 rounded text-xs font-medium">
              {category}
            </span>
          </CardFooter>
        </div>
      </a>
    </Card>
  )
}

export default Card