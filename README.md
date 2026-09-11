# Hashan Janith Wickramasooriya, Portfolio

Personal portfolio site for Hashan Janith Wickramasooriya, Software Engineer.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com): CSS-first design tokens (colors, fluid type scale, easing curves, radii) in `app/globals.css`
- [Framer Motion](https://www.framer.com/motion/) for entrance, scroll, hover and gesture animation
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- ESLint (including React Compiler's hook-safety rules) + Prettier (with `prettier-plugin-tailwindcss`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your production domain, it's used for canonical metadata, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt`.

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server             |
| `npm run build`        | Production build                 |
| `npm start`            | Serve the production build       |
| `npm run lint`         | Lint with ESLint                 |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |

## Project structure

```
app/                    Routes, layout, metadata, JSON-LD, sitemap, robots, generated favicon
components/providers/   AppShell (loading-screen gate) and Lenis smooth-scroll provider
components/ui/          Small reusable primitives: Button, Badge, SpotlightCard, Reveal,
                         StaggerGroup, MaskedHeadline, FloatingInput, AnimatedCounter,
                         SectionDivider, CustomCursor, ScrollProgressBar, icons…
components/sections/    Page sections (Nav, Hero + its Hero* subcomponents, About, Skills,
                         Services, Projects, Experience, Education, Contact, Footer)
components/LoadingScreen.tsx  The pre-load splash sequence
data/                   Typed content: edit these files to change site copy without touching components
lib/                    Motion tokens/variants and small animation hooks (magnetic buttons,
                         cursor spotlight, reduced-motion), education-status derivation,
                         plus the cn()/getInitials() helpers
types/                  Shared TypeScript types for the content model
public/images/          Profile photo, project preview clips, education logos
```

All visible copy (name, bio, skills, projects, experience, education, social links, rotating role labels) lives in `data/*.ts` and is fully typed via `types/index.ts`. Update content there; no component changes required.

## Content editing

- `data/profile.ts`: name, title, location, email, bio, resume link, social links
- `data/roles.ts`: the rotating role labels shown in the hero
- `data/skills.ts`: skills grouped by category
- `data/services.ts`: service offering cards
- `data/projects.ts`: project cards (description, tech stack, repo/live links, preview video)
- `data/experience.ts`: work experience timeline
- `data/education.ts`: education timeline (status badges are computed from each entry's period, not authored)

## Design system

Dark-only, black + blue. Tokens live at the top of `app/globals.css` as CSS custom properties (`--background`, `--accent`, `--accent-secondary`, `--text-hero`, `--ease-swift`, …) and are wired into Tailwind via a single `@theme inline` block, components reference them through Tailwind utility classes (`bg-accent`, `text-hero`, `ease-swift`) rather than hardcoded hex values or magic numbers. There is no light theme and no theme toggle by design.

## Loading experience

`components/LoadingScreen.tsx` renders a one-time splash on first load: a glowing logo mark, a progress sweep, the name typing out once, then the title fading in, before the whole overlay fades into the homepage. `components/providers/AppShell.tsx` exposes an `AppReady` context that the hero's entrance animations (`Hero`, `HeroPortrait`, `HeroStatPanel`, `HeroTechRow`, `ScrollCue`, `RotatingRole`) wait on, so nothing plays out of sight underneath the loader. Reduced-motion visitors get a short static version with no typing or progress sweep.

## Accessibility & motion

- Every animated component reads `prefers-reduced-motion` through the shared `useReducedMotion` hook (`lib/useReducedMotion.ts`); reduced-motion users get instant/static states instead of transforms, everywhere, no exceptions.
- The custom cursor and hero particles/parallax are fine-pointer only and disabled under reduced motion; nothing depends on them for functionality.
- All interactive elements have visible `:focus-visible` rings, and the nav, mobile menu, and contact form are fully keyboard-operable.

## Notes

- The contact form composes a `mailto:` link client-side (no backend or third-party email service is required) with real loading/success/error states.
- Project preview media are the original demo clips carried over from the previous build; replace the files in `public/images/projects/` and update `data/projects.ts` to swap them out.
