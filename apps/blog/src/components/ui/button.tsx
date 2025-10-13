import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'lime' | 'forest'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const buttonVariants = {
  variant: {
    primary: 'bg-growi-lime hover:bg-growi-forest text-white border border-transparent',
    secondary: 'bg-white hover:bg-growi-sand text-growi-forest border border-growi-forest',
    outline: 'bg-transparent hover:bg-growi-sand text-growi-forest border border-growi-forest',
    ghost: 'bg-transparent hover:bg-growi-sand text-growi-forest border border-transparent',
    lime: 'bg-growi-lime hover:bg-growi-lime/80 text-growi-forest border border-transparent',
    forest: 'bg-growi-forest hover:bg-growi-forest/80 text-white border border-transparent',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-growi-lime focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        // Variant styles
        buttonVariants.variant[variant],
        // Size styles
        buttonVariants.size[size],
        // Custom className
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Chargement...
        </>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button