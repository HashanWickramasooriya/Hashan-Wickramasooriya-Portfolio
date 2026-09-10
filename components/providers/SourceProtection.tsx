'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Toast } from '@/components/ui/Toast';

const PROTECTED_MESSAGE = 'This portfolio is protected.';

/** Width/height gap (px) between the outer window and the viewport that suggests a docked
 * DevTools panel is open. Generous on purpose, checked over several consecutive samples, to
 * avoid false positives from browser chrome, OS scaling, or split-screen layouts. */
const DEVTOOLS_GAP_THRESHOLD = 220;
const DEVTOOLS_POLL_MS = 900;
const DEVTOOLS_OPEN_STREAK = 3;
const DEVTOOLS_CLOSE_STREAK = 2;

/**
 * Casual, client-side "discourage inspection" layer — not real security. Disables the context
 * menu and common DevTools shortcuts (with a toast explaining why), and shows a dismissible
 * glass overlay when a DevTools panel looks docked to the window. All of this is trivially
 * bypassable and is only meant to nudge casual visitors, per the request that spawned it.
 */
export function SourceProtection() {
  const reducedMotion = useReducedMotion();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const dismissedRef = useRef(false);

  const notify = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
      notify('Right-click is disabled on this portfolio.');
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const isDevToolsShortcut =
        key === 'f12' ||
        (event.ctrlKey && event.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (event.ctrlKey && key === 'u');

      if (!isDevToolsShortcut) return;
      event.preventDefault();
      notify('Developer tools are disabled on this portfolio.');
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notify]);

  useEffect(() => {
    // This heuristic is for the live/production site only — during local development DevTools
    // is expected to be open constantly, and the resulting full-page blur overlay would otherwise
    // sit on top of the entire app (same z-index as the loading screen, mounted after it) any time
    // a developer is actually working with the console open.
    if (process.env.NODE_ENV !== 'production') return;

    // Docked DevTools panels aren't really a mobile/touch scenario, and the width/height-gap
    // heuristic is especially unreliable there — skip it entirely on coarse-pointer devices.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let openStreak = 0;
    let closeStreak = 0;

    const interval = window.setInterval(() => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      const likelyOpen = widthGap > DEVTOOLS_GAP_THRESHOLD || heightGap > DEVTOOLS_GAP_THRESHOLD;

      if (likelyOpen) {
        openStreak += 1;
        closeStreak = 0;
      } else {
        closeStreak += 1;
        openStreak = 0;
      }

      if (openStreak >= DEVTOOLS_OPEN_STREAK && !dismissedRef.current) {
        setDevtoolsOpen(true);
      }
      if (closeStreak >= DEVTOOLS_CLOSE_STREAK) {
        dismissedRef.current = false;
        setDevtoolsOpen(false);
      }
    }, DEVTOOLS_POLL_MS);

    return () => window.clearInterval(interval);
  }, []);

  function handleDismiss() {
    dismissedRef.current = true;
    setDevtoolsOpen(false);
  }

  return (
    <>
      <Toast
        open={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        title={PROTECTED_MESSAGE}
        description={toastMessage ?? ''}
        tone="notice"
        durationMs={3200}
      />

      <AnimatePresence>
        {devtoolsOpen && (
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="devtools-overlay-title"
            aria-describedby="devtools-overlay-description"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: EASE_SWIFT }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-6"
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.96 }}
              transition={
                reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 340, damping: 26 }
              }
              className="border-border-strong bg-surface/90 relative w-full max-w-sm rounded-3xl border p-8 text-center shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
            >
              <div
                aria-hidden="true"
                className="bg-accent-soft mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              >
                <svg viewBox="0 0 24 24" fill="none" className="text-accent-secondary h-8 w-8">
                  <path
                    d="M12 3 4 6.5v5c0 4.7 3.2 8.9 8 10 4.8-1.1 8-5.3 8-10v-5L12 3Z"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 12.2 11.3 14l3.2-3.9"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 id="devtools-overlay-title" className="font-display mt-5 text-xl font-semibold">
                Developer Tools Detected
              </h2>
              <p
                id="devtools-overlay-description"
                className="text-muted mt-2 text-sm leading-relaxed"
              >
                This portfolio is protected. Please respect the creator&apos;s work.
              </p>

              <button
                type="button"
                onClick={handleDismiss}
                className="from-accent to-accent-secondary text-accent-foreground ease-swift mt-7 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r px-6 py-3 text-sm font-medium shadow-[var(--shadow-glow-sm)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue Browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
