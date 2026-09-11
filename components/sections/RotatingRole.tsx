'use client';

import { useEffect, useState } from 'react';
import { roles } from '@/data/roles';
import { useTypewriter } from '@/lib/useTypewriter';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';

/** How long after the hero becomes ready the typewriter waits before its first character, so it
 * lands right after the name/title settle instead of racing them. */
const START_DELAY_MS = 1300;

/**
 * Typewriter: types a role, pauses 2s, deletes it, moves to the next, loops forever.
 * Starts once the loading screen has handed off (`ready`) and the hero name/title have had a
 * moment to settle. Keeps cycling under reduced motion too (character-by-character text swap
 * isn't a vestibular motion trigger); only the transform-heavy effects elsewhere get disabled.
 */
export function RotatingRole() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const { text } = useTypewriter(roles, { active: started, pauseMs: 2000 });

  return (
    <span className="text-accent-secondary inline-flex min-h-[1.5em] items-center font-medium">
      {text}
      {!reducedMotion && (
        <span
          aria-hidden="true"
          className="bg-accent-secondary animate-blink-caret ml-0.5 inline-block h-[1em] w-0.5 align-middle"
        />
      )}
    </span>
  );
}
