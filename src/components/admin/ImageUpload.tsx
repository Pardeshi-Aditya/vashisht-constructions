import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Link2, X } from 'lucide-react';
import { normalizeImageUrl, isUsableImageUrl } from '@/cms/images';
import { cn } from '@/utils/cn';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: string;
  className?: string;
  hint?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  aspect = 'aspect-video',
  className,
  hint = 'Paste a public image link from your shared Drive or CDN',
}: ImageUploadProps) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setDraft(value);
    setBroken(false);
    setError('');
  }, [value]);

  const applyUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      onChange('');
      setError('');
      setBroken(false);
      return;
    }

    const normalized = normalizeImageUrl(trimmed);
    if (!isUsableImageUrl(normalized)) {
      setError('Enter a full image URL starting with https:// (or a /images/… path)');
      return;
    }

    setError('');
    setBroken(false);
    setDraft(normalized);
    onChange(normalized);
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
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
            <button
              type="button"
              onClick={() => {
                setDraft('');
                onChange('');
                setBroken(false);
                setError('');
              }}
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
              {broken ? 'Couldn’t load this image — check the link' : 'Paste an image link below'}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Link2
            size={14}
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-warm-gray"
          />
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              if (draft.trim() !== value) applyUrl(draft);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyUrl(draft);
              }
            }}
            placeholder="https://…"
            className="w-full border border-stone bg-white py-2.5 pr-3 pl-9 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => applyUrl(draft)}
          className="shrink-0 border border-stone px-3 text-xs tracking-wide text-charcoal uppercase transition-colors hover:border-charcoal"
        >
          Apply
        </button>
      </div>
      <p className="mt-1.5 text-xs text-warm-gray">{hint}</p>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function GalleryUpload({ images, onChange }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const addImage = () => {
    const normalized = normalizeImageUrl(draft.trim());
    if (!normalized) return;

    if (!isUsableImageUrl(normalized)) {
      setError('Enter a full image URL starting with https://');
      return;
    }

    if (images.includes(normalized)) {
      setError('That image is already in the gallery');
      return;
    }

    onChange([...images, normalized]);
    setDraft('');
    setError('');
  };

  return (
    <div>
      <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-warm-gray uppercase">
        Gallery ({images.length})
      </p>

      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Link2
            size={14}
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-warm-gray"
          />
          <input
            ref={inputRef}
            type="url"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
            placeholder="Paste image URL and add"
            className="w-full border border-stone bg-white py-2.5 pr-3 pl-9 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => addImage()}
          className="shrink-0 bg-accent px-4 text-xs font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-accent-light"
        >
          Add
        </button>
      </div>
      {error && <p className="mb-3 text-xs text-red-700">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden bg-stone"
          >
            <img
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
          <span className="text-[10px] tracking-wide uppercase">Add URL</span>
        </button>
      </div>
      <p className="mt-3 text-xs text-warm-gray">
        Host images on your shared Drive (set sharing to anyone with the link), then paste
        each public URL here.
      </p>
    </div>
  );
}
