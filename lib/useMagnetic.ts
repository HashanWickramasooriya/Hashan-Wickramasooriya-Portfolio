'use client';

import { type PointerEvent, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

const SPRING = { stiffness: 150, damping: 15, mass: 0.2 };

/** Desktop-only magnetic pointer-follow effect. No-ops for touch input or reduced motion. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  function handlePointerMove(event: PointerEvent<T>) {
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, x: springX, y: springY, handlePointerMove, handlePointerLeave };
}
