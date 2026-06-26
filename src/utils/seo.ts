import { company } from '@/constants/company';

export interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function getCanonicalUrl(path = ''): string {
  const base = company.website.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    description: company.shortDescription,
    url: company.website,
    telephone: company.phone,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.line1,
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400002',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.coordinates.lat,
      longitude: company.coordinates.lng,
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    sameAs: Object.values(company.social),
  };
}
