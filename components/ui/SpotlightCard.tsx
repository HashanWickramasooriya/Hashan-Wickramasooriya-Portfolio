'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useSpotlight } from '@/lib/useSpotlight';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/** Card with cursor-tracked spotlight glow, brightening border, and a lift on hover. */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const { ref, handlePointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group border-border-strong bg-surface hover:border-accent/40 ease-swift relative overflow-hidden rounded-lg border transition-colors duration-300',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), var(--color-accent-soft), transparent 70%)',
        }}
      />
      {children}
    </motion.div>
  );
}
