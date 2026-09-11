'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/lib/useMagnetic';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { EASE_SWIFT } from '@/lib/motion';
import { ArrowUpRightIcon } from './icons';

interface LuxuryCtaButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Premium glassmorphism CTA, a thin animated blue-to-purple gradient border (two stacked spans
 * using a padding-box/border-box style layering, not a real CSS `border`), a frosted-glass
 * surface, an opacity-driven outer glow (never an animated `box-shadow`, which is expensive to
 * repaint every frame), and a one-shot shine sweep on hover. Everything that animates on
 * hover/tap uses `transform`/`opacity` only, so it stays on the compositor.
 */
export function LuxuryCtaButton({ href, children, className }: LuxuryCtaButtonProps) {
  const reducedMotion = useReducedMotion();
  const { ref, x, y, handlePointerMove, handlePointerLeave } = useMagnetic<HTMLAnchorElement>(0.15);

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={cn('group relative inline-block rounded-[15px] p-px select-none', className)}
    >
      {/* Outer glow, a blurred, opacity-driven layer rather than an animated box-shadow */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0.35 }}
        whileHover={{ opacity: 0.6 }}
        whileTap={{ opacity: 0.25 }}
        transition={{ duration: 0.25, ease: EASE_SWIFT }}
        className="from-accent to-accent-secondary pointer-events-none absolute -inset-2 -z-10 rounded-[20px] bg-linear-to-r blur-lg"
      />

      {/* Animated blue-to-purple gradient border, revealed by the 1px padding on the wrapper */}
      <motion.span
        aria-hidden="true"
        style={{ backgroundSize: '250% 100%' }}
        animate={reducedMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={reducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'linear' }}
        className="from-accent absolute inset-0 rounded-[15px] bg-linear-to-r via-[#a78bfa] to-accent-secondary"
      />

      {/* Glass surface */}
      <span className="relative flex items-center gap-2 overflow-hidden rounded-[14px] bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
        <motion.span
          aria-hidden="true"
          initial={{ x: '-130%' }}
          whileHover={reducedMotion ? undefined : { x: '130%' }}
          transition={{ duration: 0.65, ease: EASE_SWIFT }}
          className="absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-white/25"
        />
        <span className="relative">{children}</span>
        <ArrowUpRightIcon className="ease-swift relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
      </span>
    </motion.a>
  );
}
