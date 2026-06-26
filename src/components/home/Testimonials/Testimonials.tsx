import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { SectionTitle } from '@/components/common/SectionTitle';
import { testimonials } from '@/constants/testimonials';

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32" aria-labelledby="testimonials">
      <Container>
        <SectionTitle
          eyebrow="Testimonials"
          title={['What Our', 'Clients Say']}
          align="center"
        />

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col border-t border-stone pt-8"
            >
              <p className="flex-1 text-base leading-relaxed text-charcoal/80 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-8">
                <cite className="not-italic">
                  <p className="text-sm font-medium text-charcoal">{item.author}</p>
                  <p className="mt-1 text-xs text-warm-gray">{item.project}</p>
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
