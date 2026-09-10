import { services } from '@/data/services';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Services" title="What I can help you build." />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {services.map((service) => (
            <Reveal key={service.title} variant="scale">
              <SpotlightCard className="h-full p-7">
                <h3 className="font-display text-h3 font-semibold tracking-[-0.02em]">
                  {service.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">{service.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
