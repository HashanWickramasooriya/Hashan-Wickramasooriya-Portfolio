'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 1024px)';

/**
 * True only at the `lg` breakpoint and above. Used to gate the Projects section's motion/hover
 * effects to desktop only; tablet and mobile intentionally render the static path.
 *
 * Same hydration-safe pattern as `useReducedMotion`: `getServerSnapshot` always returns `false`,
 * so the server render and the client's first hydration pass agree (mobile-safe by default), and
 * `useSyncExternalStore` re-syncs to the real value immediately after hydration with no manual
 * effect required.
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

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
