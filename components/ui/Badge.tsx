import { HTMLAttributes, forwardRef } from 'react'

function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ')
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'accent'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const base =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-sans font-medium leading-none'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-muted/30 text-foreground',
  success: 'bg-primary/15 text-primary',
  warning: 'bg-warm/15 text-warm',
  accent: 'bg-accent/15 text-accent',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
