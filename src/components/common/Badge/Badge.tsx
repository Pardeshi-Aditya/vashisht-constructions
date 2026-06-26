import { cn } from '@/utils/cn';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}

const variantStyles = {
  default: 'bg-stone text-charcoal',
  accent: 'bg-accent/10 text-accent',
  outline: 'border border-charcoal/15 text-warm-gray',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
