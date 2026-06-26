import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export function CTA() {
  return (
    <section className="bg-accent py-20 sm:py-28" aria-labelledby="contact-cta">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h2
            id="contact-cta"
            className="heading-section text-3xl text-white sm:text-4xl md:text-5xl"
          >
            Begin Your
            <span className="block">Project</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-white/70">
            Schedule a consultation with our team to discuss your vision.
          </p>
          <div className="mt-10">
            <Button
              to="/contact"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white hover:text-accent"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
