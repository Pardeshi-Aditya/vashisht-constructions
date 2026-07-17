import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { TestimonialItem } from '@/types/cms';
import { createId } from '@/cms/images';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  Toast,
} from '@/components/admin/ui';

export default function AdminTestimonials() {
  const { content, updateContent } = useContent();
  const [items, setItems] = useState<TestimonialItem[]>(content.testimonials);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setItems(content.testimonials);
  }, [content.testimonials]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateContent({
        testimonials: items.filter((t) => t.quote.trim() && t.author.trim()),
      });
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes shown on the home page."
        actions={
          <AdminButton
            variant="primary"
            onClick={() =>
              setItems([
                ...items,
                { id: createId(), quote: '', author: '', project: '' },
              ])
            }
          >
            <Plus size={14} /> Add
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {items.length === 0 ? (
          <AdminCard>
            <p className="text-sm text-warm-gray">No testimonials yet.</p>
          </AdminCard>
        ) : (
          items.map((item, index) => (
            <AdminCard
              key={item.id}
              title={`Testimonial ${index + 1}`}
              actions={
                <AdminButton
                  variant="ghost"
                  className="!px-2"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                >
                  <Trash2 size={14} />
                </AdminButton>
              }
            >
              <div className="space-y-4">
                <AdminTextarea
                  label="Quote"
                  value={item.quote}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, quote: e.target.value };
                    setItems(next);
                  }}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput
                    label="Author"
                    value={item.author}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, author: e.target.value };
                      setItems(next);
                    }}
                  />
                  <AdminInput
                    label="Project / Context"
                    value={item.project}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, project: e.target.value };
                      setItems(next);
                    }}
                  />
                </div>
              </div>
            </AdminCard>
          ))
        )}

        <AdminButton type="submit" variant="primary">
          Save Changes
        </AdminButton>
      </form>

      {toast && <Toast message="Testimonials saved" />}
    </div>
  );
}
