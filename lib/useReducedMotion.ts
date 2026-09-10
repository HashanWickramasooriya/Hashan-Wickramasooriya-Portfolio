'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Single source of truth for prefers-reduced-motion across every animated component.
 *
 * Deliberately does NOT use framer-motion's own `useReducedMotion` hook: that hook reads
 * `matchMedia` synchronously on the client's first render pass, before React's hydration
 * diffing runs. When the browser actually has reduced motion enabled, that makes the very
 * first client render disagree with the server (which has no `window` and always renders
 * as if motion is allowed), which breaks hydration for anything gated on this value
 * (e.g. `!reducedMotion && particles.map(...)`).
 *
 * `useSyncExternalStore` is the React-native fix for exactly this class of problem: its
 * `getServerSnapshot` return value is what both the server *and* the client's first
 * hydration pass use, so they always agree. React then re-syncs with the real client
 * value (`getSnapshot`) right after hydration completes, with no manual effect needed.
 */
function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
