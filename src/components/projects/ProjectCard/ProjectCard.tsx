import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '@/types/project';
import { Badge } from '@/components/common/Badge';
import { CmsImage } from '@/components/common/CmsImage';
import { formatStatus, formatType } from '@/utils/project';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link to={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone">
          <CmsImage
            src={project.thumbnail}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {formatType(project.type)}
            </Badge>
            <Badge variant="accent" className="bg-white/90 backdrop-blur-sm">
              {formatStatus(project.status)}
            </Badge>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-medium tracking-tight text-charcoal transition-colors group-hover:text-accent">
            {project.name}
          </h2>
          <p className="mt-1 text-sm text-warm-gray">{project.location}</p>
        </div>
      </Link>
    </motion.article>
  );
}
