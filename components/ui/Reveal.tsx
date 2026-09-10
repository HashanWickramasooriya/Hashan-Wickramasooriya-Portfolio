'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  fadeUp,
  fadeUpReduced,
  fadeLeft,
  fadeLeftReduced,
  fadeRight,
  fadeRightReduced,
  scaleIn,
  scaleInReduced,
  blurReveal,
  blurRevealReduced,
  viewportOnce,
} from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

const tagMap = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
} as const;

// Each variant keeps its full and reduced-motion forms paired together (same property shape,
// see the comment in lib/motion.ts) so switching between them never strands a property like
// `filter` or `y` mid-animation.
const variantMap = {
  up: { full: fadeUp, reduced: fadeUpReduced },
  left: { full: fadeLeft, reduced: fadeLeftReduced },
  right: { full: fadeRight, reduced: fadeRightReduced },
  scale: { full: scaleIn, reduced: scaleInReduced },
  blur: { full: blurReveal, reduced: blurRevealReduced },
} as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: keyof typeof tagMap;
  /** Which reveal style plays once this element scrolls into view. Defaults to a fade-up. */
  variant?: keyof typeof variantMap;
}

export function Reveal({ children, className, as = 'div', variant = 'up' }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = tagMap[as];
  const pair = variantMap[variant];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reducedMotion ? pair.reduced : pair.full}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
