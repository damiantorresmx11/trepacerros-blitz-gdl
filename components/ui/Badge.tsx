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
  default: 'bg-stone-100 text-tc-on-surface',
  success: 'bg-tc-primary-fixed text-tc-primary',
  warning: 'bg-[#ffdcc3] text-[#5a2e00]',
  accent: 'bg-[#FF6B00]/15 text-[#FF6B00]',
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
