'use client';

import { type PointerEvent, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { TechItem } from '@/types';
import { TechLogo } from '@/components/ui/TechLogo';
import { fadeUp, fadeUpReduced } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function TechCard({ item }: { item: TechItem }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  function handlePointerMove(event: PointerEvent<HTMLLIElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(py * -14);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.li
      ref={ref}
      variants={reducedMotion ? fadeUpReduced : fadeUp}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.06 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: reducedMotion ? 0 : springRotateX,
        rotateY: reducedMotion ? 0 : springRotateY,
        transformPerspective: 600,
      }}
      className="group border-border-strong bg-surface hover:border-accent/50 relative flex aspect-square flex-col items-center justify-center rounded-2xl border transition-colors duration-300 hover:shadow-[var(--shadow-glow-sm)]"
    >
      <div className="flex flex-col items-center justify-center">
        <TechLogo
          item={item}
          className="text-muted group-hover:text-accent-secondary h-7 w-7 transition-colors duration-300 sm:h-8 sm:w-8"
        />
      </div>
      <span
        role="tooltip"
        className="border-border-strong bg-surface-raised text-foreground pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {item.name}
      </span>
    </motion.li>
  );
}
