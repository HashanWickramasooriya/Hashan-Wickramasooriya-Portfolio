'use client';

import { useMemo, useState } from 'react';
import { projects } from '@/data/projects';
import type { ProjectCategory } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { SearchIcon } from '@/components/ui/icons';
import { useIsDesktop } from '@/lib/useIsDesktop';
import { ProjectCard } from './ProjectCard';

type FilterValue = ProjectCategory | 'All';

const CATEGORIES: FilterValue[] = ['All', 'Web App', 'Mobile App', 'AI', 'E-commerce', '3D / Interactive', 'Game'];

/** Search + category filter over the full project collection. Entrance animation on the results
 * grid is desktop-only, same rule as ProjectCard — see useIsDesktop. */
export function ProjectsBrowser() {
  const isDesktop = useIsDesktop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FilterValue>('All');

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="border-border-strong bg-surface text-foreground placeholder:text-muted ease-swift w-full rounded-full border py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none lg:transition-colors lg:duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={
                  active
                    ? 'bg-accent text-accent-foreground rounded-full px-3.5 py-1.5 text-xs font-medium'
                    : 'text-muted border-border-strong lg:hover:border-accent/60 lg:hover:text-foreground rounded-full border px-3.5 py-1.5 text-xs font-medium lg:transition-colors lg:duration-200'
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted mt-16 text-center text-sm">
          No projects found. Try a different search or category.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) =>
            isDesktop ? (
              <Reveal key={project.slug} variant="blur">
                <ProjectCard project={project} />
              </Reveal>
            ) : (
              <ProjectCard key={project.slug} project={project} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
