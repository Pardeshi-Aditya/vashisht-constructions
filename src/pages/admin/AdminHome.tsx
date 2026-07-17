import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { FooterInfo, HeroInfo, StatItem, WhyChooseItem } from '@/types/cms';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  Toast,
} from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminHome() {
  const { content, updateContent, saving } = useContent();
  const [hero, setHero] = useState<HeroInfo>(content.hero);
  const [stats, setStats] = useState<StatItem[]>(content.stats);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseItem[]>(
    content.whyChooseUs,
  );
  const [footer, setFooter] = useState<FooterInfo>(content.footer);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setHero(content.hero);
    setStats(content.stats);
    setWhyChooseUs(content.whyChooseUs);
    setFooter(content.footer);
  }, [content.hero, content.stats, content.whyChooseUs, content.footer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateContent({ hero, stats, whyChooseUs, footer });
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
        title="Home Page"
        description="Hero, statistics, why choose us, and footer content."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="Hero">
          <div className="grid gap-5 sm:grid-cols-3">
            <AdminInput
              label="Line 1"
              value={hero.line1}
              onChange={(e) => setHero({ ...hero, line1: e.target.value })}
            />
            <AdminInput
              label="Line 2"
              value={hero.line2}
              onChange={(e) => setHero({ ...hero, line2: e.target.value })}
            />
            <AdminInput
              label="Line 3"
              value={hero.line3}
              onChange={(e) => setHero({ ...hero, line3: e.target.value })}
            />
            <AdminTextarea
              label="Subtitle"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="sm:col-span-3"
            />
          </div>
          <div className="mt-6 max-w-lg">
            <ImageUpload
              label="Hero Background"
              value={hero.image}
              onChange={(image) => setHero({ ...hero, image })}
              aspect="aspect-video"
            />
          </div>
        </AdminCard>

        <AdminCard
          title="Statistics"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() =>
                setStats([...stats, { value: 0, suffix: '', label: '' }])
              }
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="grid gap-3 border-t border-stone pt-5 first:border-0 first:pt-0 sm:grid-cols-[1fr_100px_1fr_auto]"
              >
                <AdminInput
                  label="Label"
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...stats];
                    next[index] = { ...stat, label: e.target.value };
                    setStats(next);
                  }}
                />
                <AdminInput
                  label="Value"
                  type="number"
                  step="any"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[index] = { ...stat, value: Number(e.target.value) };
                    setStats(next);
                  }}
                />
                <AdminInput
                  label="Suffix"
                  value={stat.suffix}
                  onChange={(e) => {
                    const next = [...stats];
                    next[index] = { ...stat, suffix: e.target.value };
                    setStats(next);
                  }}
                  hint="e.g. +, %, M"
                />
                <div className="flex items-end">
                  <AdminButton
                    variant="ghost"
                    className="!px-3"
                    onClick={() => setStats(stats.filter((_, i) => i !== index))}
                    disabled={stats.length <= 1}
                  >
                    <Trash2 size={14} />
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Why Choose Us"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() =>
                setWhyChooseUs([...whyChooseUs, { title: '', description: '' }])
              }
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-5">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="border-t border-stone pt-5 first:border-0 first:pt-0">
                <div className="mb-3 flex justify-end">
                  <AdminButton
                    variant="ghost"
                    className="!px-2"
                    onClick={() =>
                      setWhyChooseUs(whyChooseUs.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 size={14} />
                  </AdminButton>
                </div>
                <div className="space-y-4">
                  <AdminInput
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...whyChooseUs];
                      next[index] = { ...item, title: e.target.value };
                      setWhyChooseUs(next);
                    }}
                  />
                  <AdminTextarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => {
                      const next = [...whyChooseUs];
                      next[index] = { ...item, description: e.target.value };
                      setWhyChooseUs(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Footer">
          <div className="space-y-5">
            <AdminInput
              label="Headline"
              value={footer.headline}
              onChange={(e) => setFooter({ ...footer, headline: e.target.value })}
            />
            <AdminTextarea
              label="Description"
              value={footer.description}
              onChange={(e) =>
                setFooter({ ...footer, description: e.target.value })
              }
            />
            <AdminInput
              label="Copyright"
              value={footer.copyright}
              onChange={(e) =>
                setFooter({ ...footer, copyright: e.target.value })
              }
            />
          </div>
        </AdminCard>

        <AdminButton type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </AdminButton>
      </form>

      {toast && <Toast message="Home page content saved" />}
    </div>
  );
}
