import { HTMLAttributes, forwardRef } from 'react'

function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ')
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-white text-tc-on-surface p-6 shadow-sm border border-stone-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
