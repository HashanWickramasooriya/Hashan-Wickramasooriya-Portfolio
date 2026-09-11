'use client';

import { motion } from 'framer-motion';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface MaskedHeadlineProps {
  /** Each entry is one reveal unit. Text within an entry wraps naturally; it is never forced onto its own unbreakable line. */
  lines: string[];
  className?: string;
  /** Gate the reveal on an external readiness signal (e.g. the loading screen finishing). Defaults to playing immediately. */
  play?: boolean;
}

/**
 * Reveals each entry via a clip-mask translate, staggered, used for the hero headline.
 * The mask only clips vertically (overflow-y: hidden) so long words can never be clipped
 * horizontally the way `overflow: hidden` would; normal word-wrap + break-words handle the rest.
 */
export function MaskedHeadline({ lines, className, play = true }: MaskedHeadlineProps) {
  const reducedMotion = useReducedMotion();
  // Both branches always specify the same keys (`opacity` and `y`). `reducedMotion` can flip a
  // moment after mount (SSR-safe hook settling to the real client value); if the hidden/visible
  // objects didn't share a shape, a flip mid-animation would strand `y` or `opacity` at whatever
  // value was last applied instead of resolving to the new target.
  const hiddenState = reducedMotion ? { opacity: 0, y: 0 } : { opacity: 1, y: '110%' };
  const visibleState = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-x-visible overflow-y-hidden">
          <motion.span
            className="block text-balance break-words"
            initial={hiddenState}
            animate={play ? visibleState : hiddenState}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.1, ease: EASE_SWIFT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
