'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';

/** Bottom-of-hero scroll affordance: a still frame with one gently moving dot. */
export function ScrollCue() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 3.7 }}
      className="text-muted absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
    >
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Scroll</span>
      <span className="border-border-strong relative h-9 w-5 rounded-full border">
        <motion.span
          aria-hidden="true"
          className="bg-accent absolute top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          animate={reducedMotion ? undefined : { y: [0, 14, 0], opacity: [1, 0.4, 1] }}
          transition={
            reducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </span>
    </motion.div>
  );
}
