import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: string | readonly string[];
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  light?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  light = false,
}: SectionTitleProps) {
  const titleLines = Array.isArray(title) ? title : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-4 text-[10px] font-medium uppercase tracking-[0.2em]',
            light ? 'text-white/60' : 'text-warm-gray',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'heading-section text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
          light ? 'text-white' : 'text-charcoal',
        )}
      >
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-6 max-w-xl text-base leading-relaxed sm:text-lg',
            align === 'center' && 'mx-auto',
            light ? 'text-white/70' : 'text-warm-gray',
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
