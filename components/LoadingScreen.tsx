'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { EASE_SWIFT } from '@/lib/motion';

const WORD = 'Hashan';

// A single phase: the wordmark fades in while a thin line fills left-to-right beneath it, then a
// short hold before an elegant opacity-only fade-out. ~1.7s total, well inside the 1.5-2s target.
// Reduced motion runs the same sequence compressed, never an instant jump.
const DURATION_MS = 1300;
const REDUCED_DURATION_MS = 500;
const HOLD_MS = 300;
const EXIT_DURATION_S = 0.5;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // Reads the media query directly (rather than depending on the reactive `reducedMotion` value
  // above) and runs once on mount, so this timer can never be torn down and rebuilt mid-flight;
  // see the identical reasoning that used to live here when this component had a longer timeline.
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const durationMs = prefersReduced ? REDUCED_DURATION_MS : DURATION_MS;
    const timer = window.setTimeout(() => setVisible(false), durationMs + HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          aria-hidden="true"
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION_S, ease: EASE_SWIFT }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0.25 : 0.6, ease: EASE_SWIFT }}
              style={{ fontFamily: 'var(--font-cormorant)' }}
              className="text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-light tracking-[0.04em] text-white italic"
            >
              {WORD}
            </motion.p>

            <div className="relative mt-7 h-px w-32 overflow-hidden bg-white/15 sm:w-44">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: (reducedMotion ? REDUCED_DURATION_MS : DURATION_MS) / 1000,
                  ease: EASE_SWIFT,
                }}
                style={{ transformOrigin: 'left' }}
                className="h-full w-full bg-white"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
