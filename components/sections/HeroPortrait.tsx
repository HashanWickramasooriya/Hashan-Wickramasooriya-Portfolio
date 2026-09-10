'use client';

import { type PointerEvent, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { profile } from '@/data/profile';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';

const corners = ['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'];
const rings = ['-inset-4', '-inset-9'];

/** Distinctive image treatment: offset accent frame, animated corner reticle marks, static rings,
 * and a soft scroll parallax plus pointer tilt — the hero's visual centerpiece. Rings/inner glow
 * are static (not looping) and there's no scan-line sweep — kept the one-shot entrance and the
 * interactive pointer tilt, dropped the always-running decorative loops. */
export function HeroPortrait() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-18, 18]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 22 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Both branches always specify the same keys (opacity, y, scale) — see the identical fix and
  // rationale in MaskedHeadline.tsx: `reducedMotion` can legitimately flip a moment after mount,
  // and a shape mismatch between the two branches would strand `y`/`scale` at whatever value was
  // last applied instead of resolving to the new target.
  const hiddenFrame = reducedMotion ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 };
  const visibleFrame = { opacity: 1, y: 0, scale: 1 };

  return (
    // Outer element owns scroll-based parallax (its own `y` motion value); the inner element owns
    // the entrance animation + pointer tilt, so the two `y`/transform sources never fight each other.
    <motion.div ref={ref} style={{ y: parallaxY }} className="relative mx-auto aspect-4/5 w-full max-w-sm">
    <motion.div
      initial={hiddenFrame}
      animate={ready ? visibleFrame : hiddenFrame}
      transition={{ duration: 0.7, ease: EASE_SWIFT, delay: 0.2 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative h-full w-full"
    >
      {rings.map((inset) => (
        <div
          key={inset}
          aria-hidden="true"
          className={`border-accent/20 absolute -z-20 rounded-[2rem] border opacity-25 ${inset}`}
        />
      ))}

      <div
        aria-hidden="true"
        className="border-accent/50 absolute inset-3 -z-10 rounded-[1.75rem] border"
      />

      <div
        aria-hidden="true"
        className="bg-accent/40 absolute inset-6 -z-20 rounded-[1.75rem] opacity-40 blur-2xl"
      />

      <motion.div
        whileHover={reducedMotion ? undefined : { scale: 1.04 }}
        style={{
          rotateX: reducedMotion ? 0 : springRotateX,
          rotateY: reducedMotion ? 0 : springRotateY,
          transformPerspective: 800,
        }}
        transition={{ duration: 0.5, ease: EASE_SWIFT }}
        className="border-border-strong bg-surface group absolute inset-0 overflow-hidden rounded-[1.5rem] border"
      >
        <Image
          src="/images/profile.png"
          alt={profile.name}
          fill
          priority
          draggable={false}
          sizes="(min-width: 1024px) 380px, 60vw"
          className="ease-swift pointer-events-none object-cover grayscale-15 transition-[filter] duration-500 group-hover:grayscale-0"
        />
      </motion.div>

      {corners.map((position, index) => (
        <motion.span
          key={position}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.6 + index * 0.08, ease: EASE_SWIFT }}
          className={`border-accent absolute h-6 w-6 ${position}`}
          style={{
            borderTopWidth: position.includes('top') ? 2 : 0,
            borderBottomWidth: position.includes('bottom') ? 2 : 0,
            borderLeftWidth: position.includes('left') ? 2 : 0,
            borderRightWidth: position.includes('right') ? 2 : 0,
          }}
        />
      ))}
    </motion.div>
    </motion.div>
  );
}
