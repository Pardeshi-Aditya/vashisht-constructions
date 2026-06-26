import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        noIndex
      />

      <section className="flex min-h-[70vh] items-center pt-20 pb-32">
        <Container className="text-center">
          <p className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
            404
          </p>
          <h1 className="heading-display mt-4 text-5xl text-charcoal sm:text-6xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-6 max-w-md text-warm-gray">
            The page you are looking for may have been moved or no longer exists.
          </p>
          <div className="mt-10">
            <Button to="/" variant="primary">
              Return Home
            </Button>
          </div>
          <p className="mt-8">
            <Link to="/projects" className="text-xs tracking-widest text-warm-gray uppercase hover:text-charcoal">
              View Projects
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
