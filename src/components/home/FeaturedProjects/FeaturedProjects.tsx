import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Badge } from '@/components/common/Badge';
import { useContent } from '@/context/ContentContext';
import { formatStatus } from '@/utils/project';

export function FeaturedProjects() {
  const { getFeaturedProjects } = useContent();
  const featured = getFeaturedProjects();

  return (
    <section className="py-20 sm:py-28 lg:py-32" aria-labelledby="featured-projects">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="Portfolio"
            title={['Selected', 'Works']}
            description="A curated selection of residences and developments that define our approach to building."
          />
          <Link
            to="/projects"
            className="hidden shrink-0 items-center gap-2 text-xs font-medium tracking-[0.15em] text-warm-gray uppercase transition-colors hover:text-charcoal sm:flex"
          >
            View All
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featured.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Link to={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                      {formatStatus(project.status)}
                    </Badge>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium tracking-tight text-charcoal transition-colors group-hover:text-accent">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-warm-gray">{project.location}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] text-warm-gray uppercase"
          >
            View All Projects
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
