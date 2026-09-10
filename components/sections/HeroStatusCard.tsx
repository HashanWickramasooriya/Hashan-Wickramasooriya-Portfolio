'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';
import { cn } from '@/lib/utils';

interface HeroStatusCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
  floatDelay?: number;
  /** When this card fades/slides into view, distinct from `floatDelay` (which paces the ongoing idle float loop) — lets a set of cards appear one by one instead of all at once. */
  entranceDelay?: number;
  /** Shows a pulsing status dot (e.g. "Available for Work") instead of the icon-in-swatch treatment. */
  live?: boolean;
}

/** A floating glass status card — non-numeric sibling to HeroStatPanel, for short text states like availability or current focus. */
export function HeroStatusCard({
  icon,
  label,
  value,
  className,
  floatDelay = 0,
  entranceDelay = 0.3,
  live = false,
}: HeroStatusCardProps) {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={
        !ready
          ? { opacity: 0, y: 16 }
          : reducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 1, y: [0, -8, 0] }
      }
      transition={
        reducedMotion
          ? { duration: 0.5, delay: entranceDelay }
          : {
              opacity: { duration: 0.5, delay: entranceDelay },
              y: {
                duration: 6 + floatDelay,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: entranceDelay,
              },
            }
      }
      className={cn(
        'border-border-strong bg-surface/80 flex items-center gap-3 rounded-2xl border p-4 shadow-lg shadow-black/5 backdrop-blur-xl',
        className,
      )}
    >
      <span className="bg-accent-soft text-accent relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        {icon}
        {live && (
          <span
            aria-hidden="true"
            className="bg-success absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-surface)]"
          >
            {!reducedMotion && (
              <motion.span
                aria-hidden="true"
                className="bg-success absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </span>
        )}
      </span>
      <div>
        <p className="font-display text-sm leading-none font-semibold">{value}</p>
        <p className="text-muted mt-1 font-mono text-[11px] tracking-wide uppercase">{label}</p>
      </div>
    </motion.div>
  );
}
