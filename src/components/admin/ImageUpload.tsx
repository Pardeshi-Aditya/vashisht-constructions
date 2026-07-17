import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { fileToOptimizedBlob, assertImageWithinSizeLimit } from '@/cms/images';
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
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const setObjectPreview = (objectUrl: string | null) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }
    previewRef.current = objectUrl;
    setPreview(objectUrl);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');

    try {
      assertImageWithinSizeLimit(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return;
    }

    setLoading(true);

    // Instant local preview — never written into content JSON.
    const objectUrl = URL.createObjectURL(file);
    setObjectPreview(objectUrl);

    try {
      const blob = await fileToOptimizedBlob(file);
      const url = await uploadAdminImage({
        file: blob,
        folder,
        filename: filename || file.name.replace(/\.[^.]+$/, '') || 'image',
      });
      onChange(url);
      // Keep local preview until the committed/static asset is reachable
      // (production images appear after Netlify redeploy).
      const probe = new Image();
      probe.onload = () => setObjectPreview(null);
      probe.onerror = () => {
        /* keep blob preview; path is already stored for save */
      };
      probe.src = url;
    } catch (err) {
      setObjectPreview(null);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const displaySrc = preview || value;

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
        {displaySrc ? (
          <>
            <img src={displaySrc} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setObjectPreview(null);
                onChange('');
              }}
              className="absolute top-2 right-2 bg-charcoal/80 p-1.5 text-white transition-colors hover:bg-charcoal"
              aria-label={`Remove ${label}`}
              disabled={loading}
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
        {loading && displaySrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40">
            <span className="text-xs tracking-wide text-white">Processing…</span>
          </div>
        )}
      </div>
      {value && !loading && (
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
  const pendingRef = useRef<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');

    const fileList = Array.from(files);
    try {
      for (const file of fileList) {
        assertImageWithinSizeLimit(file, file.name || 'Image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return;
    }

    setLoading(true);
    const objectUrls = fileList.map((file) => URL.createObjectURL(file));
    pendingRef.current = objectUrls;
    setPendingPreviews(objectUrls);

    try {
      const uploads: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const blob = await fileToOptimizedBlob(file);
        const url = await uploadAdminImage({
          file: blob,
          folder,
          filename:
            file.name.replace(/\.[^.]+$/, '') ||
            `gallery-${Date.now()}-${i + 1}`,
        });
        uploads.push(url);
      }
      onChange([...images, ...uploads]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      pendingRef.current = [];
      setPendingPreviews([]);
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
        {pendingPreviews.map((preview, index) => (
          <div
            key={`pending-${index}`}
            className="relative aspect-[4/3] overflow-hidden bg-stone"
          >
            <img
              src={preview}
              alt={`Uploading ${index + 1}`}
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
              <span className="text-[10px] tracking-wide text-white uppercase">
                Uploading…
              </span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-stone text-warm-gray transition-colors hover:bg-stone/30 hover:text-charcoal"
        >
          <ImagePlus size={18} strokeWidth={1.5} />
          <span className="text-[10px] tracking-wide uppercase">Add</span>
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
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
