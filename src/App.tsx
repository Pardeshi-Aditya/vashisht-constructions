import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Home = lazy(() => import('@/pages/Home'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-accent" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  useScrollToTop();

  const isHome = location.pathname === '/';

  return (
    <Layout transparentNav={isHome}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/projects"
              element={
                <PageTransition>
                  <Projects />
                </PageTransition>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <PageTransition>
                  <ProjectDetails />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
