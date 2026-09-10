import type { SVGProps } from 'react';
import type { TechItem } from '@/types';

interface TechLogoProps extends SVGProps<SVGSVGElement> {
  item: TechItem;
}

/** Renders an official brand mark from pre-extracted SVG path data (see data/techStack.ts). */
export function TechLogo({ item, ...props }: TechLogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={item.path} />
    </svg>
  );
}
