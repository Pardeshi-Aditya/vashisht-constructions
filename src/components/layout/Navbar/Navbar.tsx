import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/constants/navigation';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useContent } from '@/context/ContentContext';
import { cn } from '@/utils/cn';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const { content } = useContent();
  const company = content.company;
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showTransparent = transparent && isHome && !isScrolled;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-400',
          showTransparent
            ? 'bg-transparent'
            : 'bg-off-white/95 backdrop-blur-sm border-b border-stone/60',
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className={cn(
              'text-sm font-medium tracking-[0.2em] uppercase transition-colors',
              showTransparent ? 'text-white' : 'text-charcoal',
            )}
          >
            {company.name}
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'text-xs font-medium tracking-[0.15em] uppercase transition-colors',
                    showTransparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-warm-gray hover:text-charcoal',
                    location.pathname === item.href && (showTransparent ? 'text-white' : 'text-charcoal'),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'p-2 md:hidden',
              showTransparent ? 'text-white' : 'text-charcoal',
            )}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-charcoal/40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 z-50 flex h-full w-[min(100%,320px)] flex-col bg-off-white md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex h-16 items-center justify-end px-5">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-charcoal"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col px-8 pt-4">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    className="block border-b border-stone py-5 text-2xl font-light tracking-tight text-charcoal"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-stone p-8">
              <p className="text-xs tracking-widest text-warm-gray uppercase">Contact</p>
              <a
                href={`tel:${company.phone}`}
                className="mt-2 block text-sm text-charcoal"
              >
                {company.phoneDisplay}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="mt-1 block text-sm text-warm-gray"
              >
                {company.email}
              </a>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
