import type { SiteContent } from '@/types/cms';
import type { Project } from '@/types/project';

import company from '@data/company.json';
import aboutFile from '@data/about.json';
import hero from '@data/hero.json';
import stats from '@data/stats.json';
import whyChooseUs from '@data/why-choose-us.json';
import timeline from '@data/timeline.json';
import footer from '@data/footer.json';
import testimonials from '@data/testimonials.json';
import faq from '@data/faq.json';
import projectIndex from '@data/projects/_index.json';

const projectModules = import.meta.glob('../../data/projects/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Project>;

function loadProjects(): Project[] {
  const bySlug = new Map<string, Project>();

  for (const [path, project] of Object.entries(projectModules)) {
    if (path.includes('_index.json')) continue;
    if (project?.slug) bySlug.set(project.slug, project);
  }

  return (projectIndex as string[])
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
}

export const CMS_VERSION = 1;
export const AUTH_STORAGE_KEY = 'vashisht-admin-auth';
export const ADMIN_CREDENTIALS = {
  username: 'yash',
  password: 'aditya',
} as const;

export const ADMIN_API_TOKEN = `${ADMIN_CREDENTIALS.username}:${ADMIN_CREDENTIALS.password}`;

export function loadSiteContent(): SiteContent {
  const { image: aboutImage, ...about } = aboutFile as typeof aboutFile & {
    image: string;
  };

  return {
    version: CMS_VERSION,
    company: { ...company },
    about: {
      headline: [...about.headline],
      intro: about.intro,
      story: about.story,
      mission: about.mission,
      vision: about.vision,
      history: about.history,
    },
    aboutImage,
    hero: { ...hero },
    stats: stats.map((item) => ({ ...item })),
    whyChooseUs: whyChooseUs.map((item) => ({ ...item })),
    timeline: timeline.map((item) => ({ ...item })),
    footer: { ...footer },
    testimonials: testimonials.map((item) => ({ ...item })),
    faq: faq.map((item) => ({ ...item })),
    projects: loadProjects().map((project) => ({
      ...project,
      highlights: [...project.highlights],
      amenities: [...project.amenities],
      specifications: project.specifications.map((spec) => ({ ...spec })),
      gallery: [...project.gallery],
    })),
  };
}

/** @deprecated use loadSiteContent */
export function getDefaultContent(): SiteContent {
  return loadSiteContent();
}
