import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
}

export function Container({ as: Tag = 'div', className, children, id }: ContainerProps) {
  return (
    <Tag id={id} className={cn('relative mx-auto w-full max-w-6xl px-6 sm:px-8', className)}>
      {children}
    </Tag>
  );
}
