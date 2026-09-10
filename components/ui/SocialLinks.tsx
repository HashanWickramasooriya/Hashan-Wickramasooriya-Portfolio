import type { SocialLink, SocialPlatform } from '@/types';
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon, type IconProps } from './icons';
import { cn } from '@/lib/utils';

const iconMap: Record<SocialPlatform, (props: IconProps) => React.JSX.Element> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  email: MailIcon,
};

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {links.map((link) => {
        const Icon = iconMap[link.platform];
        return (
          <li key={link.platform}>
            <a
              href={link.url}
              target={link.platform === 'email' ? undefined : '_blank'}
              rel={link.platform === 'email' ? undefined : 'noreferrer noopener'}
              aria-label={link.label}
              title={link.label}
              className="border-border-strong text-muted hover:border-accent hover:text-accent ease-swift flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
