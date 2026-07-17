import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { AboutInfo, TimelineItem } from '@/types/cms';
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  Toast,
} from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminAbout() {
  const { content, updateContent } = useContent();
  const [about, setAbout] = useState<AboutInfo>(content.about);
  const [timeline, setTimeline] = useState<TimelineItem[]>(content.timeline);
  const [aboutImage, setAboutImage] = useState(content.aboutImage);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setAbout(content.about);
    setTimeline(content.timeline);
    setAboutImage(content.aboutImage);
  }, [content.about, content.timeline, content.aboutImage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateContent({
        about: {
          ...about,
          headline: about.headline.map((h) => h.trim()).filter(Boolean),
        },
        timeline: timeline.filter((t) => t.year && t.title),
        aboutImage,
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
        title="About Page"
        description="Story, mission, vision, timeline, and studio image."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="Headline Lines">
          <div className="space-y-3">
            {about.headline.map((line, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={line}
                  onChange={(e) => {
                    const next = [...about.headline];
                    next[index] = e.target.value;
                    setAbout({ ...about, headline: next });
                  }}
                  className="w-full border border-stone bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder={`Line ${index + 1}`}
                />
                <AdminButton
                  variant="ghost"
                  className="!px-3"
                  onClick={() =>
                    setAbout({
                      ...about,
                      headline: about.headline.filter((_, i) => i !== index),
                    })
                  }
                  disabled={about.headline.length <= 1}
                >
                  <Trash2 size={14} />
                </AdminButton>
              </div>
            ))}
            <AdminButton
              variant="outline"
              onClick={() =>
                setAbout({ ...about, headline: [...about.headline, ''] })
              }
            >
              <Plus size={14} /> Add line
            </AdminButton>
          </div>
        </AdminCard>

        <AdminCard title="Copy">
          <div className="space-y-5">
            <AdminTextarea
              label="Intro"
              value={about.intro}
              onChange={(e) => setAbout({ ...about, intro: e.target.value })}
            />
            <AdminTextarea
              label="Story"
              value={about.story}
              onChange={(e) => setAbout({ ...about, story: e.target.value })}
            />
            <AdminTextarea
              label="History"
              value={about.history}
              onChange={(e) => setAbout({ ...about, history: e.target.value })}
            />
            <AdminTextarea
              label="Mission"
              value={about.mission}
              onChange={(e) => setAbout({ ...about, mission: e.target.value })}
            />
            <AdminTextarea
              label="Vision"
              value={about.vision}
              onChange={(e) => setAbout({ ...about, vision: e.target.value })}
            />
          </div>
        </AdminCard>

        <AdminCard title="Studio Image">
          <ImageUpload
            label="About Image"
            value={aboutImage}
            onChange={setAboutImage}
            aspect="aspect-[4/3]"
            className="max-w-md"
            folder="about"
            filename="studio"
          />
        </AdminCard>

        <AdminCard
          title="Timeline"
          actions={
            <AdminButton
              variant="ghost"
              className="!px-2"
              onClick={() =>
                setTimeline([
                  ...timeline,
                  { year: '', title: '', description: '' },
                ])
              }
            >
              <Plus size={14} /> Add
            </AdminButton>
          }
        >
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="border-t border-stone pt-5 first:border-0 first:pt-0">
                <div className="mb-3 flex justify-end">
                  <AdminButton
                    variant="ghost"
                    className="!px-2"
                    onClick={() =>
                      setTimeline(timeline.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 size={14} />
                  </AdminButton>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminInput
                    label="Year"
                    value={item.year}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[index] = { ...item, year: e.target.value };
                      setTimeline(next);
                    }}
                  />
                  <AdminInput
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[index] = { ...item, title: e.target.value };
                      setTimeline(next);
                    }}
                    className="sm:col-span-2"
                  />
                  <AdminTextarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[index] = { ...item, description: e.target.value };
                      setTimeline(next);
                    }}
                    className="sm:col-span-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminButton type="submit" variant="primary">
          Save Changes
        </AdminButton>
      </form>

      {toast && <Toast message="About page saved" />}
    </div>
  );
}
