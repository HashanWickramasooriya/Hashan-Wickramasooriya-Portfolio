'use client';

import { useEffect } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';

/** Oversized "HASHAN" wordmark behind the hero content. Slides in from the left and fades in on
 * load, drifts a few px with the cursor, and reads as a slow parallax layer while scrolling:
 * sliding right as the page scrolls down, returning left as you scroll back up. Everything here
 * is transform/opacity only (GPU-composited), so it stays smooth under continuous scroll. */
export function HeroBackgroundLetters() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();

  const entranceX = useMotionValue(-160);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springEntranceX = useSpring(entranceX, { stiffness: 60, damping: 20 });
  const springMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const { scrollY } = useScroll();
  const scrollX = useTransform(scrollY, [0, 800], [0, 90], { clamp: true });
  const springScrollX = useSpring(scrollX, { stiffness: 55, damping: 22 });

  const translateX = useTransform(
    [springEntranceX, springMouseX, springScrollX],
    ([ex, mx, sx]: number[]) => `${ex + mx + sx}px`,
  );
  const translateY = useTransform(springMouseY, (v) => `${v}px`);

  // One-shot slide-in-from-left on load.
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) {
      entranceX.set(0);
      return;
    }
    const controls = animate(entranceX, 0, { duration: 1.1, ease: EASE_SWIFT, delay: 0.1 });
    return () => controls.stop();
  }, [ready, reducedMotion, entranceX]);

  useEffect(() => {
    if (reducedMotion) return;

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      mouseX.set(px * 16);
      mouseY.set(py * 10);
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [reducedMotion, mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden select-none"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.07 : 0 }}
        transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
        style={{
          x: reducedMotion ? 0 : translateX,
          y: reducedMotion ? 0 : translateY,
          fontSize: 'clamp(6rem, 20vw, 22rem)',
          backgroundImage: 'linear-gradient(180deg, var(--color-accent-secondary), var(--color-accent))',
        }}
        className="font-display bg-clip-text leading-none font-bold tracking-tight text-transparent"
      >
        HASHAN
      </motion.span>
    </div>
  );
}
