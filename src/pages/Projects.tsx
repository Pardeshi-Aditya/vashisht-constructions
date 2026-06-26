import { useState, useMemo } from 'react';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { projects } from '@/data/projects';
import { filterProjects } from '@/utils/project';
import type { ProjectFilter } from '@/types/project';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');

  const filteredProjects = useMemo(
    () => filterProjects(projects, activeFilter),
    [activeFilter],
  );

  return (
    <>
      <SEO
        title="Projects"
        description="Explore our portfolio of luxury residential and commercial developments across India."
        path="/projects"
      />

      <section className="bg-off-white pt-28 pb-20 sm:pt-36 sm:pb-28">
        <Container>
          <SectionTitle
            eyebrow="Portfolio"
            title={['Our', 'Projects']}
            description="A catalogue of residences and developments shaped with care and precision."
          />

          <div className="mt-12">
            <ProjectFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className="mt-12">
            <ProjectGrid projects={filteredProjects} />
          </div>
        </Container>
      </section>
    </>
  );
}
