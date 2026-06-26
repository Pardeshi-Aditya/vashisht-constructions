export type ProjectType = 'residential' | 'commercial';
export type ProjectStatus = 'completed' | 'under-construction' | 'upcoming';

export interface ProjectSpecification {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: ProjectType;
  status: ProjectStatus;
  heroImage: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  specifications: ProjectSpecification[];
  completionDate: string;
  mapLink: string;
}

export type ProjectFilter =
  | 'all'
  | 'residential'
  | 'commercial'
  | 'completed'
  | 'under-construction'
  | 'upcoming';
