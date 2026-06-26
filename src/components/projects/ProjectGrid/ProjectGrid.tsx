import type { Project } from '@/types/project';
import { ProjectCard } from '@/components/projects/ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p className="py-20 text-center text-warm-gray">
        No projects match the selected filter.
      </p>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
