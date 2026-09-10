'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { LuxuryCtaButton } from '@/components/ui/LuxuryCtaButton';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { EASE_SWIFT } from '@/lib/motion';
import { cn, getInitials } from '@/lib/utils';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // These nav items are in-page anchors on the homepage. On any other route (e.g. /projects)
  // there's nothing on the page for them to scroll to, so they need to point back home first.
  const homeHref = isHome ? '#top' : '/';
  const resolveHref = (hash: string) => (isHome ? hash : `/${hash}`);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'ease-swift fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'bg-background/80 border-border border-b backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8"
      >
        <a href={homeHref} className="font-mono text-sm font-semibold tracking-tight">
          {getInitials(profile.name)}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={resolveHref(item.href)}
                className="text-muted hover:text-foreground ease-swift text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LuxuryCtaButton href={resolveHref('#contact')}>Let&apos;s talk</LuxuryCtaButton>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="border-border-strong text-foreground flex h-10 w-10 items-center justify-center rounded-full border"
          >
            {menuOpen ? (
              <CloseIcon className="h-4.5 w-4.5" />
            ) : (
              <MenuIcon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_SWIFT }}
            className="bg-background border-border overflow-hidden border-t px-6 md:hidden"
          >
            <ul className="flex flex-col gap-6 py-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04, ease: EASE_SWIFT }}
                >
                  <a
                    href={resolveHref(item.href)}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-xl font-medium"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {scrolled && <ScrollProgressBar />}
    </header>
  );
}
