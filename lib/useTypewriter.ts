'use client';

import { useEffect, useState } from 'react';

interface TypewriterOptions {
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseMs?: number;
  /** Freeze the whole machine (e.g. until the loading screen finishes, or under reduced motion). */
  active?: boolean;
}

/** Deterministic type → pause → delete → next-word loop, driven by a single timer chain (no flicker). */
export function useTypewriter(words: string[], options: TypewriterOptions = {}) {
  const { typingSpeedMs = 55, deletingSpeedMs = 30, pauseMs = 1500, active = true } = options;
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || words.length === 0) return;
    const current = words[wordIndex % words.length];

    if (!deleting && subIndex === current.length) {
      const timer = window.setTimeout(() => setDeleting(true), pauseMs);
      return () => window.clearTimeout(timer);
    }

    if (deleting && subIndex === 0) {
      const timer = window.setTimeout(() => {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(
      () => setSubIndex((count) => count + (deleting ? -1 : 1)),
      deleting ? deletingSpeedMs : typingSpeedMs,
    );
    return () => window.clearTimeout(timer);
  }, [active, deleting, subIndex, wordIndex, words, typingSpeedMs, deletingSpeedMs, pauseMs]);

  const text = words.length ? words[wordIndex % words.length].slice(0, subIndex) : '';
  return { text, wordIndex, deleting };
}
