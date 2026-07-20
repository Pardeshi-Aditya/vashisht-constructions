import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { toDriveImageUrl } from '@/cms/images';
import { CmsImage } from '@/components/common/CmsImage';
import { cn } from '@/utils/cn';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: string;
  className?: string;
}

/** Preview + paste a Drive image URL. Stored value is used as <img src>. */
export function ImageUpload({
  label,
  value,
  onChange,
  aspect = 'aspect-video',
  className,
}: ImageFieldProps) {
  const [draft, setDraft] = useState(value);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setDraft(value);
    setBroken(false);
  }, [value]);

  const commit = (raw: string) => {
    const next = toDriveImageUrl(raw);
    setDraft(next);
    setBroken(false);
    onChange(next);
  };

  return (
    <div className={className}>
      <p className="mb-2 text-[10px] font-medium tracking-[0.15em] text-warm-gray uppercase">
        {label}
      </p>
      <div
        className={cn(
          'relative overflow-hidden border border-dashed border-stone bg-off-white',
          aspect,
        )}
      >
        {value && !broken ? (
          <>
            <CmsImage
              src={value}
              alt={label}
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
            <button
              type="button"
              onClick={() => commit('')}
              className="absolute top-2 right-2 bg-charcoal/80 p-1.5 text-white transition-colors hover:bg-charcoal"
              aria-label={`Remove ${label}`}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-warm-gray">
            <ImagePlus size={22} strokeWidth={1.5} />
            <span className="text-xs tracking-wide">
              {broken ? 'Link didn’t load — check Drive sharing' : 'Paste a Drive link below'}
            </span>
          </div>
        )}
      </div>
      <input
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft.trim() !== value) commit(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(draft);
          }
        }}
        placeholder="https://drive.google.com/file/d/…"
        className="mt-3 w-full border border-stone bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-accent focus:outline-none"
      />
      <p className="mt-1.5 text-xs text-warm-gray">
        Share the file as “anyone with the link”, then paste the Drive URL.
      </p>
    </div>
  );
}

interface GalleryFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function GalleryUpload({ images, onChange }: GalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState('');

  const add = () => {
    const url = toDriveImageUrl(draft);
    if (!url || images.includes(url)) {
      setDraft('');
      return;
    }
    onChange([...images, url]);
    setDraft('');
  };

  return (
    <div>
      <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-warm-gray uppercase">
        Gallery ({images.length})
      </p>
      <div className="mb-4 flex gap-2">
        <input
          ref={inputRef}
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Paste Drive image URL"
          className="min-w-0 flex-1 border border-stone bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 bg-accent px-4 text-xs font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-accent-light"
        >
          Add
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden bg-stone"
          >
            <CmsImage
              src={image}
              alt={`Gallery ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 bg-charcoal/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={`Remove gallery image ${index + 1}`}
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-stone text-warm-gray transition-colors hover:bg-stone/30 hover:text-charcoal"
        >
          <ImagePlus size={18} strokeWidth={1.5} />
          <span className="text-[10px] tracking-wide uppercase">Add</span>
        </button>
      </div>
    </div>
  );
}
