import type { CompanyInfo } from '@/types/cms';

export function getCanonicalUrl(website: string, path = ''): string {
  const base = website.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
}

export function getLocalBusinessSchema(company: CompanyInfo) {
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
      streetAddress: `${company.address.line1}, ${company.address.line2}`,
      addressLocality: company.address.country,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.coordinates.lat,
      longitude: company.coordinates.lng,
    },
    openingHours: company.hours,
    sameAs: Object.values(company.social),
  };
}
