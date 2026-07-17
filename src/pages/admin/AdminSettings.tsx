import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { SiteContent } from '@/types/cms';
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  Toast,
} from '@/components/admin/ui';

export default function AdminSettings() {
  const { content, replaceAll, saving } = useContent();
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vashisht-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Content exported');
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text) as SiteContent;
      if (!imported.company || !Array.isArray(imported.projects)) {
        throw new Error('Invalid file');
      }
      await replaceAll(imported);
      showToast('Imported and written to data/ JSON files');
    } catch {
      showToast('Invalid content file', 'error');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Backup tools and how content storage works."
      />

      <div className="space-y-6">
        <AdminCard
          title="Backup & Restore"
          description="Export a full snapshot, or import one to overwrite data/ JSON files."
        >
          <div className="flex flex-wrap gap-3">
            <AdminButton variant="primary" onClick={handleExport} disabled={saving}>
              <Download size={14} strokeWidth={1.5} />
              Export Content
            </AdminButton>
            <AdminButton
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={saving}
            >
              <Upload size={14} strokeWidth={1.5} />
              Import Content
            </AdminButton>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                void handleImport(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
        </AdminCard>

        <AdminCard title="How storage works">
          <div className="space-y-3 text-sm leading-relaxed text-warm-gray">
            <p>
              All site content lives in the <code className="text-charcoal">data/</code> folder
              as segregated JSON files. Project images are stored under{' '}
              <code className="text-charcoal">public/images/</code>.
            </p>
            <p>
              When you save from the admin panel while running{' '}
              <code className="text-charcoal">npm run dev</code>, those files are updated on
              disk. Commit and push the changes, and Netlify redeploys — so the update is
              global for every visitor.
            </p>
            <p>
              Optional production auto-commit: set{' '}
              <code className="text-charcoal">GITHUB_TOKEN</code> and{' '}
              <code className="text-charcoal">GITHUB_REPO</code> in Netlify so admin saves on
              the live site commit back to GitHub automatically.
            </p>
          </div>
        </AdminCard>
      </div>

      {toast && <Toast message={toast} type={toastType} />}
    </div>
  );
}
