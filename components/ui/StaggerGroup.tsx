'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer, viewportOnce } from '@/lib/motion';

const tagMap = {
  div: motion.div,
  ul: motion.ul,
} as const;

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: keyof typeof tagMap;
}

/** Wraps Reveal/motion children; fires a staggered entrance once when scrolled into view. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.07,
  as = 'div',
}: StaggerGroupProps) {
  const MotionTag = tagMap[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(stagger)}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
