import { profile } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { TextLink } from '@/components/ui/TextLink';
import { ArrowUpIcon } from '@/components/ui/icons';

const footerLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-border border-t py-16">
      <Container>
        <a
          href="#top"
          className="font-display block text-4xl font-semibold tracking-[-0.03em] sm:text-6xl"
        >
          {profile.name}
        </a>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href} className="text-muted">
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <SocialLinks links={profile.social} />
            <TextLink href="#top" className="text-muted">
              Back to top
              <ArrowUpIcon className="h-3.5 w-3.5" />
            </TextLink>
          </div>
        </div>

        <p className="text-muted border-border mt-12 border-t pt-6 text-xs">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
