'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Ambient mouse-follow spotlight — a large, soft, low-opacity blue glow, fine-pointer only.
 * The system cursor is never hidden or replaced; this is a purely additive lighting layer,
 * GPU-accelerated (transform + opacity only, no layout properties).
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 120, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 26, mass: 0.6 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial value from a browser media query, not derivable during render
    setIsFinePointer(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => setIsFinePointer(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement;
      setIsHovering(
        Boolean(target.closest('a, button, input, textarea, [role="button"], img, svg')),
      );
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [isFinePointer, reducedMotion, x, y]);

  if (!isFinePointer || reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-100 rounded-full blur-3xl"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, var(--color-accent-secondary), transparent 70%)',
      }}
      animate={{
        width: isHovering ? 620 : 480,
        height: isHovering ? 620 : 480,
        opacity: isHovering ? 0.16 : 0.1,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
