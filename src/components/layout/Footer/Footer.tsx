import { Link } from 'react-router-dom';
import { footerNavigation } from '@/constants/navigation';
import { Container } from '@/components/common/Container';
import { SocialIcon } from '@/components/common/SocialIcon';
import { useContent } from '@/context/ContentContext';

export function Footer() {
  const { content } = useContent();
  const { company, footer } = content;

  const socialLinks = [
    { href: company.social.instagram, name: 'instagram' as const, label: 'Instagram' },
    { href: company.social.linkedin, name: 'linkedin' as const, label: 'LinkedIn' },
    { href: company.social.facebook, name: 'facebook' as const, label: 'Facebook' },
  ];

  return (
    <footer className="bg-charcoal text-white">
      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <h2 className="heading-display text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {footer.headline}
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            {footer.description}
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-block border-b border-white/30 pb-1 text-xs font-medium tracking-[0.2em] text-white uppercase transition-colors hover:border-white"
          >
            Get in Touch
          </Link>
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/10 pt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
              Navigation
            </p>
            <ul className="mt-6 space-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
              Contact
            </p>
            <address className="mt-6 space-y-2 not-italic">
              <p className="text-sm text-white/70">{company.address.line1}</p>
              <p className="text-sm text-white/70">{company.address.line2}</p>
              <a
                href={`tel:${company.phone}`}
                className="block text-sm text-white/70 transition-colors hover:text-white"
              >
                {company.phoneDisplay}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="block text-sm text-white/70 transition-colors hover:text-white"
              >
                {company.email}
              </a>
            </address>
          </div>

          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
              Follow
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ href, name, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">{footer.copyright}</p>
          <p className="text-xs tracking-[0.15em] text-white/40 uppercase">
            {company.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}
