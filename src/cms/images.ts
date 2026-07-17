/**
 * Normalize common share links (Google Drive, Dropbox) into direct image URLs.
 * Leaves already-direct https URLs and local /images/ paths unchanged.
 */
export function normalizeImageUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return '';

  // Google Drive: /file/d/{id}/… or open?id={id}
  const driveFile = /drive\.google\.com\/file\/d\/([^/]+)/i.exec(value);
  if (driveFile?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFile[1]}`;
  }

  const driveOpen = /drive\.google\.com\/open\?id=([^&]+)/i.exec(value);
  if (driveOpen?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveOpen[1]}`;
  }

  // Dropbox share links → direct download/view
  if (/dropbox\.com\//i.test(value)) {
    try {
      const url = new URL(value);
      url.searchParams.set('raw', '1');
      url.searchParams.delete('dl');
      return url.toString();
    } catch {
      return value.replace(/[?&]dl=0/, '').concat(value.includes('?') ? '&raw=1' : '?raw=1');
    }
  }

  return value;
}

/** Accept https URLs or existing site-relative /images/ paths. */
export function isUsableImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/images/')) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
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
        `Embedded image data is not allowed in ${trail}. Paste a public image URL instead (e.g. from Google Drive).`,
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
