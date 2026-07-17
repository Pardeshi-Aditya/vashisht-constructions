import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { FaqItem } from '@/types/cms';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  Toast,
} from '@/components/admin/ui';

export default function AdminFaq() {
  const { content, updateContent } = useContent();
  const [items, setItems] = useState<FaqItem[]>(content.faq);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setItems(content.faq);
  }, [content.faq]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateContent({
        faq: items.filter((f) => f.question.trim() && f.answer.trim()),
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
        title="FAQ"
        description="Questions and answers on the contact page."
        actions={
          <AdminButton
            variant="primary"
            onClick={() =>
              setItems([...items, { question: '', answer: '' }])
            }
          >
            <Plus size={14} /> Add
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {items.length === 0 ? (
          <AdminCard>
            <p className="text-sm text-warm-gray">No FAQ items yet.</p>
          </AdminCard>
        ) : (
          items.map((item, index) => (
            <AdminCard
              key={index}
              title={`Question ${index + 1}`}
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
                <AdminInput
                  label="Question"
                  value={item.question}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, question: e.target.value };
                    setItems(next);
                  }}
                />
                <AdminTextarea
                  label="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, answer: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
            </AdminCard>
          ))
        )}

        <AdminButton type="submit" variant="primary">
          Save Changes
        </AdminButton>
      </form>

      {toast && <Toast message="FAQ saved" />}
    </div>
  );
}
