import type { Project } from '@/types/project';

export interface CompanyInfo {
  name: string;
  tagline: string;
  shortDescription: string;
  founded: number;
  website: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  address: {
    line1: string;
    line2: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  social: {
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  hours: string;
}

export interface AboutInfo {
  headline: string[];
  intro: string;
  story: string;
  mission: string;
  vision: string;
  history: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

export interface WhyChooseItem {
  title: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface FooterInfo {
  headline: string;
  description: string;
  copyright: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  project: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HeroInfo {
  line1: string;
  line2: string;
  line3: string;
  subtitle: string;
  image: string;
}

export interface SiteContent {
  version: number;
  company: CompanyInfo;
  about: AboutInfo;
  stats: StatItem[];
  whyChooseUs: WhyChooseItem[];
  timeline: TimelineItem[];
  footer: FooterInfo;
  testimonials: TestimonialItem[];
  faq: FaqItem[];
  hero: HeroInfo;
  projects: Project[];
  aboutImage: string;
}

export type SiteContentKey = keyof SiteContent;
