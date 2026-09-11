import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Derives initials from a full name, the single source used by the nav, loading screen, and favicon. */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}
