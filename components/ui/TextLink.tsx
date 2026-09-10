import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
}

/** Text link with an underline that wipes in from the left and out to the right. */
export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <a
      className={cn(
        'group ease-swift relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200',
        className,
      )}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="ease-swift absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
        />
      </span>
    </a>
  );
}
