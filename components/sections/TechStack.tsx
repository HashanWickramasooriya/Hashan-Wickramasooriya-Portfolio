import { techStack } from '@/data/techStack';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { StaggerGroup } from '@/components/ui/StaggerGroup';
import { TechCard } from './TechCard';

export function TechStack() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Tech Stack"
            title="Technologies I build with."
            description="Every logo below is the real, official brand mark, not a placeholder icon."
          />
        </Reveal>

        <div className="mt-14 space-y-12">
          {techStack.map((group) => (
            <Reveal key={group.category}>
              <h3 className="text-muted font-mono text-xs font-medium tracking-[0.15em] uppercase">
                {group.category}
              </h3>
              <StaggerGroup
                as="ul"
                stagger={0.03}
                className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9"
              >
                {group.items.map((item) => (
                  <TechCard key={item.name} item={item} />
                ))}
              </StaggerGroup>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
