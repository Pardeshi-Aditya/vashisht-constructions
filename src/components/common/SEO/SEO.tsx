import { Helmet } from 'react-helmet-async';
import { company } from '@/constants/company';
import { getCanonicalUrl, getLocalBusinessSchema } from '@/utils/seo';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function SEO({ title, description, path = '', image, noIndex = false }: SEOProps) {
  const fullTitle = title === company.name ? title : `${title} | ${company.name}`;
  const canonical = getCanonicalUrl(path);
  const ogImage = image ?? `${company.website}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={company.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(getLocalBusinessSchema())}
      </script>
    </Helmet>
  );
}
