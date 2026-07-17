import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { useContent } from '@/context/ContentContext';

export function AboutPreview() {
  const { content } = useContent();
  const { about, aboutImage, company } = content;

  return (
    <section
      className="bg-white py-20 sm:py-28 lg:py-32"
      aria-labelledby="about-preview"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="relative aspect-[4/5] overflow-hidden bg-stone lg:aspect-[3/4]"
          >
            <img
              src={aboutImage}
              alt={`${company.name} studio`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <p className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
              About Us
            </p>
            <h2
              id="about-preview"
              className="heading-section mt-4 text-3xl sm:text-4xl md:text-5xl"
            >
              {about.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-8 text-base leading-relaxed text-warm-gray sm:text-lg">
              {about.intro}
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] text-charcoal uppercase transition-colors hover:text-accent"
            >
              Our Story
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
