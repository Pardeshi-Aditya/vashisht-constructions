import type { Project } from '@/types/project';

import heroImage from '@/assets/images/projects/oak-villas/hero.jpeg';
import thumbnail from '@/assets/images/projects/oak-villas/2.jpeg';
import gallery1 from '@/assets/images/projects/oak-villas/1.jpeg';
import gallery2 from '@/assets/images/projects/oak-villas/2.jpeg';
import gallery3 from '@/assets/images/projects/oak-villas/3.jpeg';
import gallery4 from '@/assets/images/projects/oak-villas/4.jpeg';

export const oakVillas: Project = {
  id: '1',
  slug: 'ganraj-apartment',
  name: 'Ganraj Apartment',
  location: 'Shirpur, Maharashtra',
  type: 'residential',
  status: 'completed',
  heroImage,
  thumbnail,
  gallery: [gallery1, gallery2, gallery3, gallery4],
  description:
    'Ganraj Apartment is a premium residential project in Shirpur offering thoughtfully designed 2 BHK homes. With only 8 exclusive apartments, the project provides a peaceful living experience complemented by modern amenities, quality interiors, and Vastu-compliant planning.',
  highlights: [
    'Only 8 premium 2 BHK apartments',
    '2 apartments on each floor',
    'Corner apartment design for better ventilation and natural light',
    'Vastu-compliant homes',
  ],
  amenities: [
    'Modular kitchen',
    'Solar facility for lift, parking & common area lighting',
    'CCTV camera security',
    'Spacious parking',
    'Premium interiors with Wall Putty & POP finish',
    'Corner apartments',
  ],
  specifications: [
    { label: 'Configuration', value: '2 BHK Premium Flats' },
    { label: 'Total Flats', value: '8' },
    { label: 'Flats Per Floor', value: '2' },
    { label: 'Built-up Area', value: '750 sq. ft.' },
    { label: 'Carpet Area', value: '650 sq. ft.' },
  ],
  completionDate: '2025-12',
  mapLink: 'https://maps.google.com/?q=Shirpur,Maharashtra',
};