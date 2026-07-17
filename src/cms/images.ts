const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.78;
/** Maximum allowed upload size for admin images (original file). */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function assertImageWithinSizeLimit(file: Blob, label = 'Image'): void {
  if (file.size > MAX_IMAGE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `${label} is ${sizeMb}MB. Maximum allowed size is 2MB.`,
    );
  }
}

function loadImageFromObjectUrl(file: File): Promise<{
  img: HTMLImageElement;
  objectUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, objectUrl });
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to compress image'));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

/** Compress an image file to a JPEG blob for binary upload (never Base64). */
export async function fileToOptimizedBlob(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }
  assertImageWithinSizeLimit(file);

  const { img, objectUrl } = await loadImageFromObjectUrl(file);
  try {
    const scale = Math.min(1, MAX_WIDTH / img.width);
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return file;
    }

    ctx.drawImage(img, 0, 0, width, height);
    return await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Recursively reject any embedded data-URL / base64 image strings. */
export function assertNoEmbeddedImages(
  value: unknown,
  trail = 'content',
): void {
  if (typeof value === 'string') {
    if (
      value.startsWith('data:image/') ||
      (value.includes('base64,') && value.length > 500)
    ) {
      throw new Error(
        `Embedded image data is not allowed in ${trail}. Upload images first so only path strings (e.g. "/images/projects/slug/hero.jpg") are saved.`,
      );
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoEmbeddedImages(item, `${trail}[${index}]`),
    );
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      assertNoEmbeddedImages(child, `${trail}.${key}`);
    }
  }
}
