import type { Variants } from 'framer-motion';

export const EASE_SWIFT = [0.16, 1, 0.3, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

// Every "Reduced" variant below intentionally mirrors the exact same property keys as its full
// counterpart (just with no/neutral movement and a shorter duration) rather than only specifying
// `opacity`. `useReducedMotion()` can legitimately flip its value a moment after mount (it starts
// `false` during SSR/hydration, then settles to the real client value). If a component is still
// mid-animation when that happens and its variants object swaps to one with a different shape,
// Framer Motion only manages properties present in the *current* target — any property missing
// from the new variant (e.g. `filter` or `y`) is never told to reset, so it gets stuck at
// whatever value was last applied. Matching shapes avoids that entirely.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SWIFT } },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_SWIFT } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_SWIFT } },
};

export const fadeLeftReduced: Variants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: EASE_SWIFT } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_SWIFT } },
};

export const fadeRightReduced: Variants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: EASE_SWIFT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_SWIFT } },
};

export const scaleInReduced: Variants = {
  hidden: { opacity: 0, scale: 1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: EASE_SWIFT } },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_SWIFT } },
};

export const blurRevealReduced: Variants = {
  hidden: { opacity: 0, y: 0, filter: 'blur(0px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.2, ease: EASE_SWIFT } },
};

export function staggerContainer(stagger = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

// A percentage margin (rather than a fixed pixel value) scales with the viewport instead of
// eating a fixed chunk of it. A flat `-80px` shrinks the IntersectionObserver's root by 80px on
// every side regardless of viewport size — on a short laptop viewport (browser zoom, display
// scaling, a small screen) or a narrow mobile width, that fixed amount can consume a large enough
// fraction of the available space that elements near an edge (e.g. the left column of a 2-column
// grid on a narrow phone) never register a large enough intersection to reliably trigger. A
// percentage-based margin keeps the same "wait until meaningfully within view" intent at any size.
export const viewportOnce = { once: true, margin: '-10%' } as const;
