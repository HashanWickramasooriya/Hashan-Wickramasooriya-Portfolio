'use client';

import type { Project } from '@/types';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { GitHubIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { useIsDesktop } from '@/lib/useIsDesktop';

/** Caps how many stack tags render inline before collapsing the rest into a "+N" badge, so a
 * project with a long stack (e.g. 10 technologies) can never push the fixed-height card taller
 * than one with a short stack. */
const MAX_VISIBLE_TAGS = 5;

const linkClasses =
  'text-foreground border-border-strong lg:hover:border-accent/60 lg:hover:bg-accent-soft lg:hover:text-accent-secondary inline-flex items-center gap-2 rounded-full border bg-white/[0.02] px-4 py-2 text-xs font-medium backdrop-blur-sm lg:transition-colors lg:duration-200';

export function ProjectCard({ project }: { project: Project }) {
  // Gates the card's motion (hover lift, cursor spotlight) to desktop only — see useIsDesktop for
  // why this is a hook rather than a CSS class: the spotlight/lift are Framer Motion props, which
  // can only be turned off in JS. Everything else that CAN be expressed in pure CSS (the link
  // hover/transition colors above) uses `lg:` responsive classes instead, a real media query.
  const isDesktop = useIsDesktop();
  const visibleTags = project.stack.slice(0, MAX_VISIBLE_TAGS);
  const extraTagCount = project.stack.length - visibleTags.length;

  const content = (
    <>
      <div>
        <h3 className="font-display text-h3 line-clamp-2 font-semibold tracking-[-0.02em]">
          {project.name}
        </h3>
        <p className="text-muted mt-2 line-clamp-3 text-sm leading-relaxed">{project.description}</p>
      </div>

      {visibleTags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {visibleTags.map((tech) => (
            <li
              key={tech}
              className="border-border-strong text-muted rounded-full border bg-transparent px-2.5 py-0.5 font-mono text-[11px] tracking-wide"
            >
              {tech}
            </li>
          ))}
          {extraTagCount > 0 && (
            <li className="border-border-strong text-muted rounded-full border bg-transparent px-2.5 py-0.5 font-mono text-[11px] tracking-wide">
              +{extraTagCount}
            </li>
          )}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className={linkClasses}>
          <GitHubIcon className="h-3.5 w-3.5" />
          GitHub
        </a>
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className={linkClasses}>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
            {project.liveUrlLabel ?? 'Live Preview'}
          </a>
        ) : (
          <span className="text-muted border-border-strong inline-flex items-center rounded-full border border-dashed px-4 py-2 text-xs font-medium">
            {project.comingSoonLabel ?? 'Coming Soon'}
          </span>
        )}
      </div>
    </>
  );

  if (!isDesktop) {
    return (
      <div className="border-border-strong bg-surface flex h-84 flex-col justify-between rounded-lg border p-5">
        {content}
      </div>
    );
  }

  return <SpotlightCard className="group flex h-84 flex-col justify-between p-5">{content}</SpotlightCard>;
}
