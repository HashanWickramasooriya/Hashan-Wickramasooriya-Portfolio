import { cn } from '@/lib/utils';

const NOISE_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Shared low-opacity fractal-noise texture — same data URI used on `body::before`, reused wherever a section needs its own confined grain layer (e.g. inside the loading screen or hero). */
export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay', className)}
      style={{ backgroundImage: NOISE_DATA_URL }}
    />
  );
}
