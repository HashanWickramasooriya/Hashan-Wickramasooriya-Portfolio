export type SocialPlatform = 'github' | 'linkedin' | 'instagram' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  aboutBio: string;
  resumeUrl: string | null;
  social: SocialLink[];
}

export type SkillCategory = 'Languages' | 'Frontend' | 'Mobile' | 'Tools';

export interface SkillGroup {
  category: SkillCategory;
  skills: string[];
}

export interface Service {
  title: string;
  description: string;
}

export type ProjectCategory = 'Web App' | 'Mobile App' | 'AI' | 'E-commerce' | '3D / Interactive' | 'Game';

export interface Project {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  category: ProjectCategory;
  repoUrl: string;
  liveUrl: string | null;
  /** Overrides the default "Live Preview" label on the liveUrl button (e.g. "Demo Video"). */
  liveUrlLabel?: string;
  /** Overrides the default "Coming Soon" text shown when liveUrl is null (e.g. "Game Coming Soon"). */
  comingSoonLabel?: string;
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  /** Company website, when present, the organization name links out to it. */
  organizationUrl?: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface EducationEntry {
  institution: string;
  period: string;
  credentials: string[];
  logo: string;
  /** Overrides the period-derived study status (e.g. a degree finished ahead of its stated end year). */
  completed?: boolean;
}

export interface TechItem {
  name: string;
  /** SVG path `d` data (viewBox 0 0 24 24), sourced from simple-icons, verified official marks only. */
  path: string;
}

export interface TechCategory {
  category: string;
  items: TechItem[];
}
