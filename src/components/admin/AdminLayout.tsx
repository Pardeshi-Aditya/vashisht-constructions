import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/company', label: 'Company', icon: Building2 },
  { to: '/admin/about', label: 'About', icon: BookOpen },
  { to: '/admin/home', label: 'Home Page', icon: Home },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { logout } = useAuth();
  const { content } = useContent();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-warm-gray hover:bg-stone/50 hover:text-charcoal',
            )
          }
        >
          <Icon size={16} strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-off-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-stone bg-white lg:flex">
        <div className="border-b border-stone px-5 py-5">
          <p className="text-[10px] tracking-[0.2em] text-warm-gray uppercase">Admin</p>
          <p className="mt-1 truncate text-sm font-medium text-charcoal">
            {content.company.name}
          </p>
        </div>
        <Nav />
        <div className="space-y-1 border-t border-stone p-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-warm-gray transition-colors hover:text-charcoal"
          >
            <ExternalLink size={16} strokeWidth={1.5} />
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-warm-gray transition-colors hover:text-charcoal"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone bg-white/95 px-4 backdrop-blur-sm lg:px-8">
          <button
            type="button"
            className="p-2 text-charcoal lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <p className="text-xs tracking-[0.15em] text-warm-gray uppercase lg:hidden">
            Admin Panel
          </p>
          <div className="hidden lg:block" />
          <Link
            to="/"
            target="_blank"
            className="text-xs tracking-wide text-warm-gray transition-colors hover:text-charcoal"
          >
            View site ↗
          </Link>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,280px)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-stone px-4 py-4">
              <p className="text-sm font-medium text-charcoal">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <Nav onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-stone p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-warm-gray"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
