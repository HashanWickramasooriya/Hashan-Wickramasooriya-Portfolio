'use client';

import { motion } from 'framer-motion';
import { viewportOnce } from '@/lib/motion';

/** A hairline rule that draws itself in accent-to-transparent once, on scroll into view. Used sparingly between sections. */
export function SectionDivider() {
  return (
    <div className="relative mx-auto h-px w-full max-w-6xl px-6 sm:px-8">
      <div className="bg-border h-px w-full" />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="from-accent to-accent-secondary absolute inset-x-6 top-0 h-px origin-left bg-linear-to-r sm:inset-x-8"
      />
    </div>
  );
}
