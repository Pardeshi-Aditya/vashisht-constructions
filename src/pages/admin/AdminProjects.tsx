import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { AdminPageHeader, AdminButton, Toast } from '@/components/admin/ui';
import { formatStatus, formatType } from '@/utils/project';

export default function AdminProjects() {
  const { projects, deleteProject, saving } = useContent();
  const [toast, setToast] = useState('');

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
    } catch {
      setToast('Failed to delete project. Is the dev server running?');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Add, edit, or remove projects shown on the website."
        actions={
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-accent-light"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add Project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="border border-dashed border-stone bg-white px-6 py-16 text-center">
          <p className="text-sm text-warm-gray">No projects yet.</p>
          <Link
            to="/admin/projects/new"
            className="mt-4 inline-block text-xs tracking-widest text-accent uppercase hover:underline"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden border border-stone bg-white">
          <ul className="divide-y divide-stone">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5"
              >
                <div className="h-20 w-full shrink-0 overflow-hidden bg-stone sm:h-16 sm:w-24">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-charcoal">{project.name}</p>
                  <p className="mt-0.5 text-xs text-warm-gray">
                    {project.location} · {formatType(project.type)} ·{' '}
                    {formatStatus(project.status)}
                  </p>
                  <p className="mt-1 text-[10px] tracking-wide text-warm-gray/80">
                    /projects/{project.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-1.5 border border-stone px-3 py-2 text-xs text-charcoal transition-colors hover:border-charcoal"
                  >
                    <Pencil size={12} strokeWidth={1.5} />
                    Edit
                  </Link>
                  <AdminButton
                    variant="ghost"
                    className="!px-3"
                    onClick={() => handleDelete(project.id, project.name)}
                    aria-label={`Delete ${project.name}`}
                    disabled={saving}
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </AdminButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {toast && <Toast message={toast} type="error" />}
    </div>
  );
}
