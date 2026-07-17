import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Building2,
  MessageSquareQuote,
  HelpCircle,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { formatStatus } from '@/utils/project';

export default function AdminDashboard() {
  const { content, projects } = useContent();

  const cards = [
    {
      label: 'Projects',
      value: projects.length,
      href: '/admin/projects',
      icon: FolderKanban,
    },
    {
      label: 'Testimonials',
      value: content.testimonials.length,
      href: '/admin/testimonials',
      icon: MessageSquareQuote,
    },
    {
      label: 'FAQ Items',
      value: content.faq.length,
      href: '/admin/faq',
      icon: HelpCircle,
    },
    {
      label: 'Company',
      value: content.company.name.split(' ')[0],
      href: '/admin/company',
      icon: Building2,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Manage your website content from one place."
        actions={
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-accent-light"
          >
            <Plus size={14} strokeWidth={1.5} />
            New Project
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            to={href}
            className="group border border-stone bg-white p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-start justify-between">
              <Icon size={18} className="text-warm-gray" strokeWidth={1.5} />
              <ArrowUpRight
                size={14}
                className="text-warm-gray opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-6 text-2xl font-light tracking-tight text-charcoal">{value}</p>
            <p className="mt-1 text-xs tracking-widest text-warm-gray uppercase">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdminCard
          title="Recent Projects"
          description="Latest projects on your site"
          actions={
            <Link to="/admin/projects" className="text-xs text-accent hover:underline">
              View all
            </Link>
          }
        >
          {projects.length === 0 ? (
            <p className="text-sm text-warm-gray">No projects yet. Create your first one.</p>
          ) : (
            <ul className="divide-y divide-stone">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-off-white/80"
                  >
                    <div className="h-12 w-16 shrink-0 overflow-hidden bg-stone">
                      {project.thumbnail && (
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-warm-gray">
                        {project.location} · {formatStatus(project.status)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
