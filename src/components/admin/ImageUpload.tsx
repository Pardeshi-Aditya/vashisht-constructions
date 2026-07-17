import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { fileToOptimizedDataUrl } from '@/cms/images';
import { uploadAdminImage } from '@/cms/api';
import { cn } from '@/utils/cn';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: string;
  className?: string;
  folder?: string;
  filename?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  aspect = 'aspect-video',
  className,
  folder = 'uploads',
  filename,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      try {
        const url = await uploadAdminImage({
          dataUrl,
          folder,
          filename: filename || file.name,
        });
        onChange(url);
      } catch {
        // Fallback: keep optimized data URL in form until content save materializes it
        onChange(dataUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
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
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-charcoal/80 p-1.5 text-white transition-colors hover:bg-charcoal"
              aria-label={`Remove ${label}`}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-warm-gray transition-colors hover:bg-stone/40 hover:text-charcoal"
          >
            <ImagePlus size={22} strokeWidth={1.5} />
            <span className="text-xs tracking-wide">
              {loading ? 'Processing…' : 'Upload image'}
            </span>
          </button>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs text-accent hover:underline"
        >
          Replace image
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export function GalleryUpload({
  images,
  onChange,
  folder = 'uploads',
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    try {
      const uploads: string[] = [];
      for (const file of Array.from(files)) {
        const dataUrl = await fileToOptimizedDataUrl(file);
        try {
          const url = await uploadAdminImage({
            dataUrl,
            folder,
            filename: file.name,
          });
          uploads.push(url);
        } catch {
          uploads.push(dataUrl);
        }
      }
      onChange([...images, ...uploads]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-medium tracking-[0.15em] text-warm-gray uppercase">
          Gallery ({images.length})
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-xs text-accent hover:underline"
        >
          {loading ? 'Uploading…' : 'Add images'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image.slice(0, 40)}-${index}`}
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
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-stone text-warm-gray transition-colors hover:bg-stone/30 hover:text-charcoal"
        >
          <ImagePlus size={18} strokeWidth={1.5} />
          <span className="text-[10px] tracking-wide uppercase">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
