import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ContentProvider } from '@/context/ContentContext';
import { AuthProvider } from '@/context/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Home = lazy(() => import('@/pages/Home'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'));
const AdminProjectForm = lazy(() => import('@/pages/admin/AdminProjectForm'));
const AdminCompany = lazy(() => import('@/pages/admin/AdminCompany'));
const AdminAbout = lazy(() => import('@/pages/admin/AdminAbout'));
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));
const AdminTestimonials = lazy(() => import('@/pages/admin/AdminTestimonials'));
const AdminFaq = lazy(() => import('@/pages/admin/AdminFaq'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-accent" />
    </div>
  );
}

function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Layout transparentNav={isHome}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

function AppRoutes() {
  const location = useLocation();
  useScrollToTop();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location}>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectForm />} />
          <Route path="projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faq" element={<AdminFaq />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route element={<PublicLayout />}>
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
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ContentProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ContentProvider>
    </HelmetProvider>
  );
}
