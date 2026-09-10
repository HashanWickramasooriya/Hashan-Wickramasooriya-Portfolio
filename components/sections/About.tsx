import { profile } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const facts: Array<{ label: string; value: string }> = [
  { label: 'Based in', value: profile.location },
  { label: 'Role', value: profile.title },
  { label: 'Focus', value: 'Full stack development' },
];

const aboutParagraphs = profile.aboutBio.split('\n\n');

export function About() {
  return (
    <section id="about" className="py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="About" title="A bit about my journey." />
        </Reveal>

        {/* Asymmetric 12-col editorial grid — bio and facts sit on either side of a deliberate gutter break */}
        <div className="mt-8 grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
          <Reveal variant="left" className="space-y-3 lg:col-span-7">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-body-lg text-foreground leading-relaxed text-balance">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal variant="right" className="lg:col-span-4 lg:col-start-9">
            <dl className="border-border divide-border divide-y rounded-lg border">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between px-5 py-3">
                  <dt className="text-muted text-sm">{fact.label}</dt>
                  <dd className="text-foreground text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
