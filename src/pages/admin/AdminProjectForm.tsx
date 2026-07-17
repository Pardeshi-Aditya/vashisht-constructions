import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminButton,
  Toast,
} from '@/components/admin/ui';
import { ImageUpload, GalleryUpload } from '@/components/admin/ImageUpload';
import { createId, createSlug } from '@/cms/images';
import type { Project, ProjectStatus, ProjectType } from '@/types/project';

function emptyProject(): Project {
  return {
    id: createId(),
    slug: '',
    name: '',
    location: '',
    type: 'residential',
    status: 'upcoming',
    heroImage: '',
    thumbnail: '',
    gallery: [],
    description: '',
    highlights: [''],
    amenities: [''],
    specifications: [{ label: '', value: '' }],
    completionDate: '',
    mapLink: '',
  };
}

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { getProjectById, saveProject, projects, saving } = useContent();
  const [form, setForm] = useState<Project>(emptyProject);
  const [toast, setToast] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existing = getProjectById(id);
      if (existing) {
        setForm({
          ...existing,
          highlights: existing.highlights.length ? [...existing.highlights] : [''],
          amenities: existing.amenities.length ? [...existing.amenities] : [''],
          specifications: existing.specifications.length
            ? existing.specifications.map((s) => ({ ...s }))
            : [{ label: '', value: '' }],
          gallery: [...existing.gallery],
        });
        setSlugTouched(true);
      }
    }
  }, [id, isNew, getProjectById]);

  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : createSlug(name),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const slug = form.slug || createSlug(form.name);
    const slugTaken = projects.some(
      (p) => p.slug === slug && p.id !== form.id,
    );
    if (slugTaken) {
      setToast('Slug already in use. Choose another.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    if (!form.heroImage || !form.thumbnail) {
      setToast('Hero and thumbnail images are required.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const cleaned: Project = {
      ...form,
      slug,
      highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
      amenities: form.amenities.map((a) => a.trim()).filter(Boolean),
      specifications: form.specifications.filter(
        (s) => s.label.trim() && s.value.trim(),
      ),
      gallery: form.gallery.filter(Boolean),
    };

    try {
      await saveProject(cleaned);
      navigate('/admin/projects');
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Save failed');
      setTimeout(() => setToast(''), 3500);
    }
  };

  return (
    <div>
      <Link
        to="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-xs tracking-wide text-warm-gray hover:text-charcoal"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to projects
      </Link>

      <AdminPageHeader
        title={isNew ? 'New Project' : 'Edit Project'}
        description={
          isNew
            ? 'Fill in the details and upload images for this project.'
            : `Editing ${form.name || 'project'}`
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="Basics">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="Project Name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <AdminInput
              label="URL Slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update('slug', createSlug(e.target.value));
              }}
              hint="Used in /projects/your-slug"
              required
            />
            <AdminInput
              label="Location"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              required
            />
            <AdminInput
              label="Completion Date"
              type="month"
              value={form.completionDate}
              onChange={(e) => update('completionDate', e.target.value)}
              required
            />
            <AdminSelect
              label="Type"
              value={form.type}
              onChange={(e) => update('type', e.target.value as ProjectType)}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </AdminSelect>
            <AdminSelect
              label="Status"
              value={form.status}
              onChange={(e) => update('status', e.target.value as ProjectStatus)}
            >
              <option value="completed">Completed</option>
              <option value="under-construction">Under Construction</option>
              <option value="upcoming">Upcoming</option>
            </AdminSelect>
            <AdminInput
              label="Map Link"
              value={form.mapLink}
              onChange={(e) => update('mapLink', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="sm:col-span-2"
            />
            <AdminTextarea
              label="Description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="sm:col-span-2"
              required
            />
          </div>
        </AdminCard>

        <AdminCard title="Images">
          <p className="mb-6 text-xs text-warm-gray">
            Upload images to your shared Drive, set them to “anyone with the link”, then
            paste the URLs below.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Hero Image"
              value={form.heroImage}
              onChange={(v) => update('heroImage', v)}
              aspect="aspect-[16/10]"
            />
            <ImageUpload
              label="Thumbnail"
              value={form.thumbnail}
              onChange={(v) => update('thumbnail', v)}
              aspect="aspect-[4/3]"
            />
          </div>
          <div className="mt-8">
            <GalleryUpload
              images={form.gallery}
              onChange={(gallery) => update('gallery', gallery)}
            />
          </div>
        </AdminCard>

        <AdminCard
          title="Highlights"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() => update('highlights', [...form.highlights, ''])}
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-3">
            {form.highlights.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...form.highlights];
                    next[index] = e.target.value;
                    update('highlights', next);
                  }}
                  className="w-full border border-stone bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder={`Highlight ${index + 1}`}
                />
                <AdminButton
                  variant="ghost"
                  className="!px-3"
                  onClick={() =>
                    update(
                      'highlights',
                      form.highlights.filter((_, i) => i !== index),
                    )
                  }
                  disabled={form.highlights.length <= 1}
                >
                  <Trash2 size={14} />
                </AdminButton>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Amenities"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() => update('amenities', [...form.amenities, ''])}
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-3">
            {form.amenities.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...form.amenities];
                    next[index] = e.target.value;
                    update('amenities', next);
                  }}
                  className="w-full border border-stone bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder={`Amenity ${index + 1}`}
                />
                <AdminButton
                  variant="ghost"
                  className="!px-3"
                  onClick={() =>
                    update(
                      'amenities',
                      form.amenities.filter((_, i) => i !== index),
                    )
                  }
                  disabled={form.amenities.length <= 1}
                >
                  <Trash2 size={14} />
                </AdminButton>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Specifications"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() =>
                update('specifications', [
                  ...form.specifications,
                  { label: '', value: '' },
                ])
              }
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-3">
            {form.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  value={spec.label}
                  onChange={(e) => {
                    const next = [...form.specifications];
                    next[index] = { ...next[index], label: e.target.value };
                    update('specifications', next);
                  }}
                  className="border border-stone bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder="Label"
                />
                <input
                  value={spec.value}
                  onChange={(e) => {
                    const next = [...form.specifications];
                    next[index] = { ...next[index], value: e.target.value };
                    update('specifications', next);
                  }}
                  className="border border-stone bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder="Value"
                />
                <AdminButton
                  variant="ghost"
                  className="!px-3"
                  onClick={() =>
                    update(
                      'specifications',
                      form.specifications.filter((_, i) => i !== index),
                    )
                  }
                  disabled={form.specifications.length <= 1}
                >
                  <Trash2 size={14} />
                </AdminButton>
              </div>
            ))}
          </div>
        </AdminCard>

        <div className="flex flex-wrap gap-3">
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create Project' : 'Save Changes'}
          </AdminButton>
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/projects')}
            disabled={saving}
          >
            Cancel
          </AdminButton>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast}
          type={
            /required|slug|fail|not allowed|invalid|upload/i.test(toast)
              ? 'error'
              : 'success'
          }
        />
      )}
    </div>
  );
}
