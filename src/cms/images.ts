/** Convert a Google Drive share link into a URL that works in <img src>. */
export function toDriveImageUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return '';

  const id =
    /drive\.google\.com\/file\/d\/([^/]+)/i.exec(value)?.[1] ||
    /drive\.google\.com\/open\?id=([^&]+)/i.exec(value)?.[1] ||
    /[?&]id=([^&]+)/i.exec(value)?.[1];

  if (id && /drive\.google\.com/i.test(value)) {
    // Direct-ish image URL; pair with referrerPolicy="no-referrer" on <img>
    return `https://lh3.googleusercontent.com/d/${id}`;
  }

  return value;
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

/** Reject Base64 / data-URL images in content JSON. */
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
        `Embedded image data is not allowed in ${trail}. Paste a Google Drive image link instead.`,
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
