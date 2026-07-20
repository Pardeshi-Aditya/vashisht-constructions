import { motion } from 'framer-motion';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { SectionTitle } from '@/components/common/SectionTitle';
import { CmsImage } from '@/components/common/CmsImage';
import { Stats } from '@/components/home/Stats';
import { useContent } from '@/context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about, timeline, aboutImage, company } = content;

  return (
    <>
      <SEO title="About" description={about.intro} path="/about" />

      <section className="bg-off-white pt-28 pb-16 sm:pt-36 sm:pb-24">
        <Container>
          <SectionTitle
            eyebrow="Our Story"
            title={about.headline}
            description={about.intro}
          />
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone">
              <CmsImage
                src={aboutImage}
                alt={`${company.name} team at work`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Our History
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
                {about.story}
              </p>
              <p className="mt-6 text-base leading-relaxed text-warm-gray">
                {about.history}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
                {about.mission}
              </p>
            </div>
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Vision
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
                {about.vision}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Stats />

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow="Timeline" title={['Our', 'Journey']} />

          <div className="mt-16 space-y-0">
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="grid gap-4 border-t border-stone py-8 sm:grid-cols-[120px_1fr] sm:gap-8"
              >
                <span className="text-sm font-medium tracking-widest text-accent">
                  {item.year}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
