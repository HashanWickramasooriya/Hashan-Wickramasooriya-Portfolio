'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { HeroBackgroundLetters } from './HeroBackgroundLetters';

/** Preset positions/timings — deterministic so server and client markup match (no Math.random() at render).
 * Kept intentionally small: each one is its own always-running Framer Motion animation. */
const particles = [
  { top: '18%', left: '12%', size: 3, duration: 9, delay: 0 },
  { top: '58%', left: '20%', size: 2.5, duration: 8, delay: 2.4 },
  { top: '68%', left: '64%', size: 3, duration: 12, delay: 0.6 },
];

/** Soft drifting grid, cursor-reactive accent glow, and a handful of floating particles — confined to the hero. */
export function HeroBackground() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(38);
  const springX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 60, damping: 20 });
  const left = useTransform(springX, (v) => `${v}%`);
  const top = useTransform(springY, (v) => `${v}%`);

  useEffect(() => {
    if (reducedMotion) return;

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      glowX.set((event.clientX / window.innerWidth) * 100);
      glowY.set((event.clientY / window.innerHeight) * 100);
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [reducedMotion, glowX, glowY]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <HeroBackgroundLetters />

      {/* Fine "blueprint" grid — a second, denser layer beneath the main grid for extra engineering-drawing depth.
          Both grid layers fade in slowly as the loading screen hands off, rather than snapping to full opacity. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.03 : 0 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.05 : 0 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.15 }}
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <NoiseOverlay />
      {/* Ambient glow — a static base light layer (no longer an always-running sweep loop) */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] left-[25%] h-120 w-120 rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-secondary), transparent 70%)',
        }}
      />

      {/* Cursor-reactive glow */}
      <motion.div
        className="absolute h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          left: reducedMotion ? '50%' : left,
          top: reducedMotion ? '35%' : top,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, var(--color-accent-soft), transparent 70%)',
        }}
      />

      {!reducedMotion &&
        particles.map((particle, index) => (
          <motion.span
            key={index}
            className="bg-accent-secondary absolute rounded-full"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -22, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
}
