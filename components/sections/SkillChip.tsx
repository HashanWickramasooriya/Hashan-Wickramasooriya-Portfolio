'use client';

import { motion } from 'framer-motion';
import { fadeUp, fadeUpReduced } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function SkillChip({ skill }: { skill: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.li
      variants={reducedMotion ? fadeUpReduced : fadeUp}
      whileHover={reducedMotion ? undefined : { y: -3, rotate: -1.5 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="border-border-strong text-muted hover:border-accent hover:text-accent hover:bg-accent-soft inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wide transition-colors duration-200"
    >
      {skill}
    </motion.li>
  );
}
