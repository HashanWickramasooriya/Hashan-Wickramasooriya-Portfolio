import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'border-border-strong text-muted inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  );
}
