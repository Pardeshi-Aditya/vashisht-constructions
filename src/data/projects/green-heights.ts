import type { Project } from '@/types/project';

import heroImage from '@/assets/images/projects/green-heights/hero.webp';
import thumbnail from '@/assets/images/projects/green-heights/thumb.webp';
import gallery1 from '@/assets/images/projects/green-heights/1.webp';
import gallery2 from '@/assets/images/projects/green-heights/2.webp';
import gallery3 from '@/assets/images/projects/green-heights/3.webp';
import gallery4 from '@/assets/images/projects/green-heights/4.webp';

export const greenHeights: Project = {
  id: '2',
  slug: 'green-heights',
  name: 'Green Heights',
  location: 'Koregaon Park, Pune',
  type: 'residential',
  status: 'under-construction',
  heroImage,
  thumbnail,
  gallery: [gallery1, gallery2, gallery3, gallery4],
  description:
    'Green Heights reimagines urban living in one of Pune\'s most coveted neighbourhoods. This boutique collection of twelve residences rises above a canopy of mature trees, offering generous floor plans, private terraces, and interiors finished with Italian marble and custom joinery.',
  highlights: [
    'Twelve exclusive residences across six floors',
    'Only two homes per floor for maximum privacy',
    'Rooftop garden and residents\' lounge',
    'LEED Platinum pre-certified building',
  ],
  amenities: [
    'Rooftop terrace garden',
    'Residents\' lounge',
    'Fitness centre',
    'Concierge services',
    'Basement parking (2 per unit)',
    'High-speed elevators',
    'CCTV surveillance',
    'Power backup',
  ],
  specifications: [
    { label: 'Total Units', value: '12' },
    { label: 'Built-up Area', value: '2,800 – 3,600 sq. ft.' },
    { label: 'Bedrooms', value: '3 – 4' },
    { label: 'Floors', value: 'G + 6' },
    { label: 'Expected Completion', value: 'December 2026' },
  ],
  completionDate: '2026-12',
  mapLink: 'https://maps.google.com/?q=Koregaon+Park,Pune',
};
