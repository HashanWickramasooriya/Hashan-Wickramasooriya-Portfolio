'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { CheckIcon, AlertIcon } from './icons';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  durationMs?: number;
  /** 'success' (default) shows a checkmark; 'notice' shows an alert glyph for non-confirmation messages (e.g. the source-protection toasts). Both keep the same blue accent. */
  tone?: 'success' | 'notice';
}

/** Top-right glass toast — a secondary, less intrusive confirmation alongside the success modal. Auto-dismisses. */
export function Toast({
  open,
  onClose,
  title,
  description,
  durationMs = 4000,
  tone = 'success',
}: ToastProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, onClose, durationMs]);

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-100 sm:top-24 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reducedMotion ? { opacity: 0, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0, x: 0, scale: 1 } : { opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE_SWIFT }}
            className="border-border-strong bg-surface/85 pointer-events-auto flex w-72 items-start gap-3 rounded-2xl border p-4 shadow-[0_16px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:w-80"
          >
            <span className="bg-accent-soft text-accent-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              {tone === 'success' ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <AlertIcon className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-semibold">{title}</p>
              <p className="text-muted mt-0.5 text-xs leading-relaxed">{description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="text-muted hover:text-foreground ease-swift shrink-0 transition-colors duration-200"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                &times;
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
