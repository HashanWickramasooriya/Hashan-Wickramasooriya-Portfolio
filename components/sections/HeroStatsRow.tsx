'use client';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useAppReady } from '@/components/providers/AppShell';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/** In-flow stats strip (as opposed to the floating panels) — visible at every breakpoint, not just desktop. */
export function HeroStatsRow({ stats, startDelayS = 0 }: { stats: Stat[]; startDelayS?: number }) {
  const ready = useAppReady();

  return (
    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dd className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              active={ready}
              durationS={2}
              delayS={startDelayS}
            />
          </dd>
          <dt className="text-muted mt-1 text-xs font-medium">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
