import type { Project, ProjectFilter } from '@/types/project';

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  if (filter === 'all') return projects;

  if (filter === 'residential' || filter === 'commercial') {
    return projects.filter((project) => project.type === filter);
  }

  return projects.filter((project) => project.status === filter);
}

export function formatStatus(status: Project['status']): string {
  const labels: Record<Project['status'], string> = {
    completed: 'Completed',
    'under-construction': 'Under Construction',
    upcoming: 'Upcoming',
  };
  return labels[status];
}

export function formatType(type: Project['type']): string {
  return type === 'residential' ? 'Residential' : 'Commercial';
}

export function formatCompletionDate(date: string): string {
  const [year, month] = date.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}
