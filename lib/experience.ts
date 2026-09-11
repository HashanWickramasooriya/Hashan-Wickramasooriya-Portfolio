import type { ExperienceEntry } from '@/types';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function parseMonthYear(value: string): Date | null {
  const match = value.trim().match(/^([a-z]{3,})\s+(\d{4})$/i);
  if (!match) return null;
  const monthIndex = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
  if (monthIndex === -1) return null;
  return new Date(Number(match[2]), monthIndex, 1);
}

/** Whole years between the earliest experience entry's start date and today, computed, never authored. */
export function getYearsOfExperience(entries: ExperienceEntry[]): number {
  const starts = entries.map((entry) => parseMonthYear(entry.startDate)).filter(Boolean) as Date[];
  if (starts.length === 0) return 0;
  const earliest = starts.reduce((min, date) => (date < min ? date : min));
  const months = (Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  return Math.max(1, Math.floor(months / 12));
}
