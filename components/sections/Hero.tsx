'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { techStack } from '@/data/techStack';
import { experience } from '@/data/experience';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { MaskedHeadline } from '@/components/ui/MaskedHeadline';
import { LayersIcon, BarChartIcon, CheckIcon, BlueprintIcon } from '@/components/ui/icons';
import { fadeUp, fadeUpReduced, EASE_SWIFT } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppReady } from '@/components/providers/AppShell';
import { getYearsOfExperience } from '@/lib/experience';
import { HeroPortrait } from './HeroPortrait';
import { HeroBackground } from './HeroBackground';
import { HeroStatPanel } from './HeroStatPanel';
import { HeroStatsRow } from './HeroStatsRow';
import { HeroStatusCard } from './HeroStatusCard';
import { HeroTechRow } from './HeroTechRow';
import { RotatingRole } from './RotatingRole';
import { ScrollCue } from './ScrollCue';

const techCount = techStack.reduce((total, group) => total + group.items.length, 0);
const yearsExperience = getYearsOfExperience(experience);
const currentFocus = 'Full Stack Development';
const heroStats = [
  { value: projects.length, suffix: '+', label: 'Projects Completed' },
  { value: techCount, suffix: '+', label: 'Technologies' },
  { value: yearsExperience, suffix: '+', label: 'Years Learning' },
  { value: 100, suffix: '%', label: 'Dedication' },
];

// Explicit entrance timeline (seconds after `ready`), matching the requested reveal order:
// background/grid/watermark (handled by HeroBackground) -> portrait -> name -> title -> typewriter
// (handled internally by RotatingRole) -> bio -> stats -> floating cards -> buttons -> social/tech row
// -> scroll cue. Individual transition delays below, not an index-based stagger, since the desired
// order doesn't match DOM order (buttons render above stats but must appear after them).
const NAME_DELAY_MS = 250;
const TITLE_DELAY = 1.3;
const BIO_DELAY = 1.5;
const STATS_DELAY = 2.0;
const CARD_BASE_DELAY = 2.3;
const CARD_STEP = 0.2;
const BUTTONS_DELAY = 3.1;
const SOCIAL_DELAY = 3.3;
const TECH_LABEL_DELAY = 3.5;

export function Hero() {
  const reducedMotion = useReducedMotion();
  const ready = useAppReady();
  const fade = reducedMotion ? fadeUpReduced : fadeUp;
  const [nameReady, setNameReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setNameReady(true), NAME_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);

  // Scroll-linked "everything responds" layer, on top of the one-shot entrance timeline above.
  // These are pure functions of scroll position, not one-shot animations, so scrolling back up
  // always returns every value smoothly to its start with no extra state to manage.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], reducedMotion ? [1, 1] : [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], reducedMotion ? [0, 0] : [0, -48]);
  const statsOpacity = useTransform(scrollYProgress, [0, 0.32], reducedMotion ? [1, 1] : [1, 0]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.08]);
  const techRowX = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -24]);
  const cardY = [
    useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -30]),
    // This card is also vertically centered (top-1/2 + -50%), and framer's `y` style writes the
    // whole `transform`, so the -50% has to live inside this same motion value instead of a
    // separate Tailwind translate utility, or it would get silently overwritten.
    useTransform(
      useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -55]),
      (v) => `calc(-50% + ${v}px)`,
    ),
    useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -22]),
    useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -65]),
  ];

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-24 sm:pt-40"
    >
      <HeroBackground />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="max-w-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-accent flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase"
          >
            <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
            {profile.location}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted mt-4 font-mono text-sm tracking-wide"
          >
            Hello, I&apos;m
          </motion.p>

          <h1 className="font-display text-hero mt-2 leading-[1.15] font-semibold tracking-[-0.03em]">
            <MaskedHeadline lines={[profile.name]} play={nameReady} />
          </h1>

          <div className="mt-6">
            <motion.p
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: TITLE_DELAY }}
              className="text-foreground text-lg font-semibold"
            >
              {profile.title}
            </motion.p>
            <motion.p
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: TITLE_DELAY }}
              className="mt-1 text-lg font-medium"
            >
              <RotatingRole />
            </motion.p>

            <motion.p
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: BIO_DELAY }}
              className="text-muted mt-6 text-base leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            <motion.div style={{ opacity: statsOpacity }}>
              <motion.div
                initial="hidden"
                animate={ready ? 'visible' : 'hidden'}
                variants={fade}
                transition={{ duration: 0.6, ease: EASE_SWIFT, delay: STATS_DELAY }}
              >
                <HeroStatsRow stats={heroStats} startDelayS={STATS_DELAY} />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: BUTTONS_DELAY }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button href="#projects" variant="primary">
                View Projects
              </Button>
              <Button href="#contact" variant="secondary" showArrow={false}>
                Contact
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: SOCIAL_DELAY }}
              className="mt-10"
            >
              <SocialLinks links={profile.social} />
            </motion.div>

            <motion.p
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={fade}
              transition={{ duration: 0.6, ease: EASE_SWIFT, delay: TECH_LABEL_DELAY }}
              className="text-muted mt-10 font-mono text-[11px] tracking-[0.15em] uppercase"
            >
              Currently working with
            </motion.p>
            <motion.div style={{ x: techRowX }}>
              <HeroTechRow startDelayS={TECH_LABEL_DELAY + 0.15} />
            </motion.div>
          </div>
        </motion.div>

        <div className="relative">
          <motion.div style={{ scale: portraitScale }}>
            <HeroPortrait />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <motion.div
              style={{ y: cardY[0] }}
              className="pointer-events-auto absolute -top-6 -right-8 w-44"
            >
              <HeroStatPanel
                icon={<BarChartIcon className="h-5 w-5" />}
                value={projects.length}
                suffix="+"
                label="Projects Completed"
                floatDelay={0}
                entranceDelay={CARD_BASE_DELAY}
              />
            </motion.div>
            <motion.div style={{ y: cardY[1] }} className="pointer-events-auto absolute top-1/2 -left-12 w-40">
              <HeroStatPanel
                icon={<LayersIcon className="h-5 w-5" />}
                value={techCount}
                suffix="+"
                label="Technologies"
                floatDelay={1.4}
                entranceDelay={CARD_BASE_DELAY + CARD_STEP}
              />
            </motion.div>
            <motion.div
              style={{ y: cardY[2] }}
              className="pointer-events-auto absolute -bottom-8 left-6 w-40"
            >
              <HeroStatusCard
                icon={<CheckIcon className="h-5 w-5" />}
                value="Available"
                label="For Work"
                live
                floatDelay={0.7}
                entranceDelay={CARD_BASE_DELAY + CARD_STEP * 2}
              />
            </motion.div>
            <motion.div
              style={{ y: cardY[3] }}
              className="pointer-events-auto absolute -bottom-8 -right-6 w-44"
            >
              <HeroStatusCard
                icon={<BlueprintIcon className="h-5 w-5" />}
                value={currentFocus}
                label="Current Focus"
                floatDelay={2.1}
                entranceDelay={CARD_BASE_DELAY + CARD_STEP * 3}
              />
            </motion.div>
          </div>
        </div>
      </Container>

      <ScrollCue />
    </section>
  );
}
