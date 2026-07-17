import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useContent } from '@/context/ContentContext';

export function Hero() {
  const { content } = useContent();
  const { hero, company } = content;

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt={`${company.name} luxury architecture`}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>

      <div className="relative z-10 w-full pb-24 pt-32 sm:pb-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="heading-display text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              <span className="block">{hero.line1}</span>
              <span className="block">{hero.line2}</span>
              <span className="block">{hero.line3}</span>
            </h1>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              {hero.subtitle}
            </p>
            <div className="mt-10">
              <Button
                to="/projects"
                variant="outline"
                className="border-white/30 text-white hover:border-white hover:bg-white hover:text-charcoal"
              >
                View Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
        aria-hidden="true"
      >
        <ArrowDown
          size={20}
          className="animate-bounce text-white/50"
          strokeWidth={1.5}
        />
      </motion.div>
    </section>
  );
}
