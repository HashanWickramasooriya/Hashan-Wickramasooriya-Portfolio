'use client';

import { type PointerEvent, useRef } from 'react';

/** Tracks pointer position within an element as CSS custom properties (--x, --y) for spotlight/glow effects. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  function handlePointerMove(event: PointerEvent<T>) {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }

  return { ref, handlePointerMove };
}
