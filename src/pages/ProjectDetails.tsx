import { useParams, Navigate } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjectBySlug, getRelatedProjects } from '@/data/projects';
import { formatStatus, formatType, formatCompletionDate } from '@/utils/project';

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const related = getRelatedProjects(project.slug);

  return (
    <>
      <SEO
        title={project.name}
        description={project.description.slice(0, 160)}
        path={`/projects/${project.slug}`}
        image={project.heroImage}
      />

      <section className="relative h-[50vh] min-h-[400px] sm:h-[60vh]">
        <img
          src={project.heroImage}
          alt={project.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute right-0 bottom-0 left-0">
          <Container className="pb-10 sm:pb-14">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/90">
                {formatType(project.type)}
              </Badge>
              <Badge variant="accent" className="bg-white/90">
                {formatStatus(project.status)}
              </Badge>
            </div>
            <h1 className="heading-display mt-4 text-4xl text-white sm:text-5xl md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <MapPin size={14} strokeWidth={1.5} />
              {project.location}
            </p>
          </Container>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Overview
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80 sm:text-lg">
                {project.description}
              </p>

              <h2 className="mt-12 text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-charcoal/80 sm:text-base">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="space-y-8">
              <div className="border border-stone p-6">
                <h3 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                  Completion
                </h3>
                <p className="mt-2 text-lg text-charcoal">
                  {formatCompletionDate(project.completionDate)}
                </p>
              </div>

              <div className="border border-stone p-6">
                <h3 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                  Specifications
                </h3>
                <dl className="mt-4 space-y-3">
                  {project.specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 text-sm">
                      <dt className="text-warm-gray">{spec.label}</dt>
                      <dd className="text-right font-medium text-charcoal">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
            Gallery
          </h2>
          <div className="mt-8">
            <ProjectGallery images={project.gallery} projectName={project.name} />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Amenities
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.amenities.map((amenity) => (
                  <li key={amenity} className="text-sm text-charcoal/80">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Location
              </h2>
              <p className="mt-4 text-sm text-warm-gray">{project.location}</p>
              <a
                href={project.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium tracking-widest text-accent uppercase"
              >
                View on Map
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 sm:py-20">
        <Container className="text-center">
          <h2 className="heading-section text-2xl text-white sm:text-3xl">
            Interested in this project?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70">
            Speak with our team to learn more about availability and pricing.
          </p>
          <div className="mt-8">
            <Button
              to="/contact"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white hover:text-accent"
            >
              Enquire Now
            </Button>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container>
            <h2 className="heading-section text-2xl sm:text-3xl">Related Projects</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {related.map((item, index) => (
                <ProjectCard key={item.id} project={item} index={index} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
