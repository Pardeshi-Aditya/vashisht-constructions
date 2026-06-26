import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { SectionTitle } from '@/components/common/SectionTitle';
import { whyChooseUs } from '@/constants/company';

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 lg:py-32" aria-labelledby="why-choose-us">
      <Container>
        <SectionTitle
          eyebrow="Our Approach"
          title={['Built on', 'Principles']}
          description="The values that guide every project we undertake."
        />

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:gap-16">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="border-t border-stone pt-8"
            >
              <span className="text-xs tracking-widest text-warm-gray">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-xl font-medium tracking-tight text-charcoal">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-gray sm:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
