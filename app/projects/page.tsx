import type { Metadata } from 'next';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsBrowser } from '@/components/sections/ProjectsBrowser';

export const metadata: Metadata = {
  title: 'Projects',
  description: "The full collection of projects I've designed and built, searchable and filterable by category.",
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32">
          <Container>
            <SectionHeading
              eyebrow="Projects"
              title="All projects."
              description="Every project I've designed and built, searchable and filterable by category."
            />
            <div className="mt-12">
              <ProjectsBrowser />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
