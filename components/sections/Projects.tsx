'use client';

import Link from 'next/link';
import { featuredProjects } from '@/data/projects';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRightIcon } from '@/components/ui/icons';
import { useIsDesktop } from '@/lib/useIsDesktop';
import { ProjectCard } from './ProjectCard';

export function Projects() {
  // Homepage shows a small curated sample; the full collection lives on /projects. Entrance
  // animations here are desktop-only — see useIsDesktop and ProjectCard for the same rule.
  const isDesktop = useIsDesktop();

  const heading = (
    <SectionHeading
      eyebrow="Projects"
      title="Recent work."
      description="A selection of web and mobile applications I've designed and built end to end."
    />
  );

  return (
    <section id="projects" className="py-24 sm:py-32">
      <Container>
        {isDesktop ? <Reveal>{heading}</Reveal> : heading}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) =>
            isDesktop ? (
              <Reveal key={project.slug} variant="blur">
                <ProjectCard project={project} />
              </Reveal>
            ) : (
              <ProjectCard key={project.slug} project={project} />
            ),
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="text-foreground border-border-strong lg:hover:border-accent/60 lg:hover:bg-accent-soft lg:hover:text-accent-secondary inline-flex items-center gap-2 rounded-full border bg-white/[0.02] px-5 py-2.5 text-sm font-medium backdrop-blur-sm lg:transition-colors lg:duration-200"
          >
            See More Projects
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
