import { oakVillas } from './oak-villas';
import { greenHeights } from './green-heights';
import { skylineResidences } from './skyline-residences';

export const projects = [oakVillas, greenHeights, skylineResidences];

export { oakVillas, greenHeights, skylineResidences };

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(currentSlug: string, limit = 2) {
  return projects.filter((project) => project.slug !== currentSlug).slice(0, limit);
}

export function getFeaturedProjects(limit = 3) {
  return projects.slice(0, limit);
}
