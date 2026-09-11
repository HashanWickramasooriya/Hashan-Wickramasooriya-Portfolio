'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';
import { cn } from '@/lib/utils';

interface HeroStatPanelProps {
  icon: ReactNode;
  value: number;
  suffix?: string;
  label: string;
  className?: string;
  floatDelay?: number;
  /** When this card fades/slides into view, distinct from `floatDelay` (which paces the ongoing idle float loop); lets a set of cards appear one by one instead of all at once. */
  entranceDelay?: number;
}

/** A floating glass stat card, one of the small engineering-dashboard-style panels around the hero portrait. */
export function HeroStatPanel({
  icon,
  value,
  suffix,
  label,
  className,
  floatDelay = 0,
  entranceDelay = 0.3,
}: HeroStatPanelProps) {
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
      <span className="bg-accent-soft text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </span>
      <div>
        <p className="font-display text-lg leading-none font-semibold">
          <AnimatedCounter value={value} suffix={suffix} active={ready} delayS={entranceDelay} />
        </p>
        <p className="text-muted mt-1 font-mono text-[11px] tracking-wide uppercase">{label}</p>
      </div>
    </motion.div>
  );
}
