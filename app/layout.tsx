import type { Metadata } from 'next';
import { Cormorant_Garamond, Instrument_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/data/profile';
import { AppShell } from '@/components/providers/AppShell';
import './globals.css';

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

// Closest available match to "Snasm Light Italic" for the loading screen's wordmark, an elegant,
// light-weight serif italic in the same luxury/editorial register.
const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300'],
  style: ['italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const title = `${profile.name} - ${profile.title}`;
const description = profile.bio;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s - ${profile.name}`,
  },
  description,
  keywords: [
    'Hashan Janith Wickramasooriya',
    'Software Engineer',
    'Full Stack Developer',
    'Portfolio',
    'Sri Lanka',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    siteName: profile.name,
    images: [{ url: '/images/profile.png', width: 1200, height: 1500, alt: profile.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/profile.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.title,
  email: profile.email,
  address: {
    '@type': 'PostalAddress',
    addressCountry: profile.location,
  },
  url: siteUrl,
  sameAs: profile.social.filter((link) => link.platform !== 'email').map((link) => link.url),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
 