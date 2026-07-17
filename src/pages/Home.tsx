import { SEO } from '@/components/common/SEO';
import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { AboutPreview } from '@/components/home/AboutPreview';
import { Stats } from '@/components/home/Stats';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';
import { useContent } from '@/context/ContentContext';

export default function Home() {
  const { content } = useContent();
  const company = content.company;

  return (
    <>
      <SEO
        title={company.name}
        description={company.shortDescription}
        path="/"
      />
      <Hero />
      <FeaturedProjects />
      <AboutPreview />
      <Stats />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </>
  );
}
