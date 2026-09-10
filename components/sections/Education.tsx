'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { education } from '@/data/education';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { getStudyStatus } from '@/lib/education';

export function Education() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.85', 'end 0.6'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <section id="education" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Education" title="Where I studied." />
        </Reveal>

        <div ref={railRef} className="relative mt-14 pl-8 sm:pl-12">
          <div aria-hidden="true" className="bg-border absolute top-0 bottom-0 left-0 w-px" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="bg-accent absolute top-0 left-0 w-px origin-top"
          />

          <ol className="space-y-8">
            {education.map((entry) => {
              const status = getStudyStatus(entry.period);
              const inProgress = status === 'In Progress';

              return (
                <Reveal as="li" key={entry.institution} className="relative">
                  <span
                    aria-hidden="true"
                    className="bg-accent ring-background absolute top-10 -left-8 h-3 w-3 -translate-x-1/2 rounded-full ring-4 sm:-left-12"
                  />

                  <SpotlightCard className="bg-surface/70 backdrop-blur-xl">
                    <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
                      <div className="border-border-strong bg-surface-raised flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border p-4 sm:h-28 sm:w-28">
                        <Image
                          src={entry.logo}
                          alt={`${entry.institution} logo`}
                          width={96}
                          height={96}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <h3 className="font-display text-h3 font-semibold tracking-[-0.02em]">
                            {entry.institution}
                          </h3>
                          <span
                            className={
                              inProgress
                                ? 'bg-accent-soft text-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide uppercase'
                                : 'text-muted border-border-strong inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide uppercase'
                            }
                          >
                            {inProgress && (
                              <span
                                aria-hidden="true"
                                className="bg-accent h-1.5 w-1.5 rounded-full"
                              />
                            )}
                            {status}
                          </span>
                        </div>

                        <p className="text-muted mt-1.5 font-mono text-xs tracking-wide">
                          {entry.period}
                        </p>

                        <ul className="text-foreground/90 mt-4 space-y-1.5 text-sm leading-relaxed">
                          {entry.credentials.map((credential) => (
                            <li key={credential} className="flex gap-2.5">
                              <span aria-hidden="true" className="text-accent">
                                •
                              </span>
                              <span>{credential}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
