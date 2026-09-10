'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'error';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  variant: Variant;
  title: string;
  description: string;
  actionLabel: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function SuccessIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9">
      <motion.circle
        cx="24"
        cy="24"
        r="21"
        stroke="var(--color-accent-secondary)"
        strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.5, ease: EASE_SWIFT }}
      />
      <motion.path
        d="M15 24.5 21 30.5 33 17.5"
        stroke="var(--color-accent-secondary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.4, ease: EASE_SWIFT, delay: 0.45 }}
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9">
      <motion.circle
        cx="24"
        cy="24"
        r="21"
        stroke="var(--color-danger)"
        strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.5, ease: EASE_SWIFT }}
      />
      <motion.path
        d="M17 17 31 31M31 17 17 31"
        stroke="var(--color-danger)"
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.4, ease: EASE_SWIFT, delay: 0.45 }}
      />
    </svg>
  );
}

/** Centered glass dialog — success/error confirmation for the contact form. Blurs the backdrop,
 * traps focus while open, and closes on Escape or an outside click. */
export function Modal({ open, onClose, variant, title, description, actionLabel }: ModalProps) {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable?.[0] ?? panel)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  const accentClasses = variant === 'success' ? 'bg-accent-soft' : 'bg-danger/15';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          onClick={onClose}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3, ease: EASE_SWIFT }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-6"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            initial={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={
              reducedMotion
                ? { duration: 0.2 }
                : { type: 'spring', stiffness: 340, damping: 26 }
            }
            className="border-border-strong bg-surface/90 relative w-full max-w-sm rounded-3xl border p-8 text-center shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl focus:outline-none"
          >
            <div
              aria-hidden="true"
              className={cn(
                'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
                accentClasses,
              )}
            >
              {variant === 'success' ? <SuccessIcon /> : <ErrorIcon />}
            </div>

            <h2 id="modal-title" className="font-display mt-5 text-xl font-semibold">
              {title}
            </h2>
            <p id="modal-description" className="text-muted mt-2 text-sm leading-relaxed">
              {description}
            </p>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                'ease-swift ring-offset-surface mt-7 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]',
                variant === 'success'
                  ? 'from-accent to-accent-secondary text-accent-foreground bg-linear-to-r shadow-[var(--shadow-glow-sm)] focus-visible:ring-accent'
                  : 'bg-danger/90 text-accent-foreground focus-visible:ring-danger',
              )}
            >
              {actionLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
