'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { EASE_SWIFT } from '@/lib/motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  /** Extra gate beyond in-view, e.g. "don't start until the loading screen is done." Defaults to true. */
  active?: boolean;
  /** Fixed duration in seconds, deterministic, unlike spring physics, so "finishes in ~2s" is exact. */
  durationS?: number;
  /** Seconds to wait, once in-view and active, before counting starts; lets a counter's start line up with when its card actually becomes visible (e.g. a staggered floating card). */
  delayS?: number;
}

/** Counts up from 0 to value once, when scrolled into view (and active). Reduced-motion still counts up
 * (a plain number change isn't a vestibular motion trigger) but compresses the duration and drops easing. */
export function AnimatedCounter({
  value,
  suffix = '',
  className,
  active = true,
  durationS = 2,
  delayS = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Percentage margin, not a fixed pixel value; see the identical rationale on `viewportOnce`
  // in lib/motion.ts. A flat -80px disproportionately shrinks the trigger zone on narrow/short
  // viewports, which is exactly what made specific grid columns unreliable on some phones.
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || !active) return;
    const controls = animate(motionValue, value, {
      duration: reducedMotion ? Math.min(0.8, durationS) : durationS,
      delay: delayS,
      ease: reducedMotion ? 'linear' : EASE_SWIFT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, active, reducedMotion, motionValue, value, durationS, delayS]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
