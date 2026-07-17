import { useEffect, useState, type FormEvent } from 'react';
import { useContent } from '@/context/ContentContext';
import type { CompanyInfo } from '@/types/cms';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  Toast,
} from '@/components/admin/ui';

export default function AdminCompany() {
  const { content, updateContent, saving } = useContent();
  const [form, setForm] = useState<CompanyInfo>(content.company);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setForm(content.company);
  }, [content.company]);

  const set = <K extends keyof CompanyInfo>(key: K, value: CompanyInfo[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateContent({ company: form });
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
        title="Company & Contact"
        description="Details used across the navbar, footer, contact page, and SEO."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="Brand">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="Company Name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            <AdminInput
              label="Tagline"
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
            <AdminTextarea
              label="Short Description"
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              className="sm:col-span-2"
            />
            <AdminInput
              label="Website URL"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />
            <AdminInput
              label="Founded Year"
              type="number"
              value={form.founded}
              onChange={(e) => set('founded', Number(e.target.value))}
            />
          </div>
        </AdminCard>

        <AdminCard title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
            <AdminInput
              label="Phone (display)"
              value={form.phoneDisplay}
              onChange={(e) => {
                set('phoneDisplay', e.target.value);
                set('phone', e.target.value);
              }}
              required
            />
            <AdminInput
              label="WhatsApp Number"
              value={form.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              hint="Digits only, with country code (e.g. 919421889619)"
            />
            <AdminInput
              label="Business Hours"
              value={form.hours}
              onChange={(e) => set('hours', e.target.value)}
            />
          </div>
        </AdminCard>

        <AdminCard title="Address">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="Address Line 1"
              value={form.address.line1}
              onChange={(e) =>
                set('address', { ...form.address, line1: e.target.value })
              }
              className="sm:col-span-2"
            />
            <AdminInput
              label="Address Line 2"
              value={form.address.line2}
              onChange={(e) =>
                set('address', { ...form.address, line2: e.target.value })
              }
              className="sm:col-span-2"
            />
            <AdminInput
              label="City / Country"
              value={form.address.country}
              onChange={(e) =>
                set('address', { ...form.address, country: e.target.value })
              }
              className="sm:col-span-2"
            />
            <AdminInput
              label="Latitude"
              type="number"
              step="any"
              value={form.coordinates.lat}
              onChange={(e) =>
                set('coordinates', {
                  ...form.coordinates,
                  lat: Number(e.target.value),
                })
              }
            />
            <AdminInput
              label="Longitude"
              type="number"
              step="any"
              value={form.coordinates.lng}
              onChange={(e) =>
                set('coordinates', {
                  ...form.coordinates,
                  lng: Number(e.target.value),
                })
              }
            />
          </div>
        </AdminCard>

        <AdminCard title="Social Links">
          <div className="grid gap-5 sm:grid-cols-1">
            <AdminInput
              label="Instagram"
              value={form.social.instagram}
              onChange={(e) =>
                set('social', { ...form.social, instagram: e.target.value })
              }
            />
            <AdminInput
              label="LinkedIn"
              value={form.social.linkedin}
              onChange={(e) =>
                set('social', { ...form.social, linkedin: e.target.value })
              }
            />
            <AdminInput
              label="Facebook"
              value={form.social.facebook}
              onChange={(e) =>
                set('social', { ...form.social, facebook: e.target.value })
              }
            />
          </div>
        </AdminCard>

        <AdminButton type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </AdminButton>
      </form>

      {toast && <Toast message="Company details saved" />}
    </div>
  );
}
