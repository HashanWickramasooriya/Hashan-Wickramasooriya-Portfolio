'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experience } from '@/data/experience';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowUpRightIcon } from '@/components/ui/icons';

export function Experience() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.85', 'end 0.6'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <section id="experience" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I've worked." />
        </Reveal>

        <div ref={railRef} className="relative mt-12 pl-8 sm:pl-10">
          <div aria-hidden="true" className="bg-border absolute top-0 bottom-0 left-0 w-px" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="bg-accent absolute top-0 left-0 w-px origin-top"
          />

          <ol className="space-y-12">
            {experience.map((entry) => (
              <Reveal as="li" key={`${entry.organization}-${entry.startDate}`} className="relative">
                <span
                  aria-hidden="true"
                  className="bg-accent absolute top-1.5 -left-[calc(2rem+1px)] h-2.5 w-2.5 -translate-x-1/2 rounded-full sm:-left-[calc(2.5rem+1px)]"
                />
                <p className="text-muted font-mono text-xs tracking-wide uppercase">
                  {entry.startDate} - {entry.endDate}
                </p>
                <h3 className="font-display text-h3 mt-2 font-semibold tracking-[-0.02em]">
                  {entry.role}
                </h3>
                {entry.organizationUrl ? (
                  <a
                    href={entry.organizationUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent ease-swift group/org inline-flex items-center gap-1 text-sm font-medium underline decoration-transparent decoration-2 underline-offset-4 transition-all duration-200 hover:decoration-current"
                  >
                    {entry.organization}
                    <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/org:translate-x-0.5 group-hover/org:-translate-y-0.5" />
                  </a>
                ) : (
                  <p className="text-accent text-sm font-medium">{entry.organization}</p>
                )}
                <p className="text-muted mt-3 text-sm leading-relaxed">{entry.summary}</p>
                <ul className="text-muted mt-4 space-y-2 text-sm">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-accent">
                        •
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
