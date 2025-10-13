import { LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  className,
  required,
  children,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-growi-forest font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
})

Label.displayName = 'Label'

export default Label