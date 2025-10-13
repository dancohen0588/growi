import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeVariants = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
}

export default function Container({ 
  children, 
  className,
  size = 'xl' 
}: ContainerProps) {
  return (
    <div className={cn(
      'container mx-auto px-4 sm:px-6 lg:px-8',
      sizeVariants[size],
      className
    )}>
      {children}
    </div>
  )
}

// Helper component for sections
export function Section({ 
  children, 
  className,
  ...props 
}: ContainerProps) {
  return (
    <section className={cn('py-12 lg:py-20', className)} {...props}>
      <Container>
        {children}
      </Container>
    </section>
  )
}