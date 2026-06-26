import type { Project } from '@/types/project';

import heroImage from '@/assets/images/projects/skyline-residences/hero.webp';
import thumbnail from '@/assets/images/projects/skyline-residences/thumb.webp';
import gallery1 from '@/assets/images/projects/skyline-residences/1.webp';
import gallery2 from '@/assets/images/projects/skyline-residences/2.webp';
import gallery3 from '@/assets/images/projects/skyline-residences/3.webp';
import gallery4 from '@/assets/images/projects/skyline-residences/4.webp';

export const skylineResidences: Project = {
  id: '3',
  slug: 'skyline-residences',
  name: 'Skyline Residences',
  location: 'Worli, Mumbai',
  type: 'commercial',
  status: 'upcoming',
  heroImage,
  thumbnail,
  gallery: [gallery1, gallery2, gallery3, gallery4],
  description:
    'Skyline Residences is a landmark mixed-use tower poised at the intersection of Worli and the sea. Designed for discerning professionals and boutique enterprises, the development combines premium office floors with a curated retail podium and panoramic harbour views.',
  highlights: [
    '32-storey mixed-use tower with sea-facing offices',
    'Double-height lobby with art installation programme',
    'Grade A specifications with 4.2m floor-to-floor height',
    'Targeting IGBC Platinum certification',
  ],
  amenities: [
    'Multi-level parking',
    'High-speed destination dispatch elevators',
    'Central HVAC with VRF systems',
    'Café and retail at podium level',
    'Rooftop event terrace',
    '24/7 building management',
    'Advanced fire safety systems',
    'Fiber-optic connectivity',
  ],
  specifications: [
    { label: 'Total Built-up Area', value: '4,80,000 sq. ft.' },
    { label: 'Office Floors', value: '8 – 30' },
    { label: 'Typical Floor Plate', value: '18,000 sq. ft.' },
    { label: 'Structure', value: 'Composite steel and concrete' },
    { label: 'Expected Completion', value: 'March 2028' },
  ],
  completionDate: '2028-03',
  mapLink: 'https://maps.google.com/?q=Worli,Mumbai',
};
