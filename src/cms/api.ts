import { ADMIN_API_TOKEN } from '@/cms/defaults';
import {
  assertImageWithinSizeLimit,
  assertNoEmbeddedImages,
} from '@/cms/images';
import type { SiteContent } from '@/types/cms';

async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('X-Admin-Token', ADMIN_API_TOKEN);

  // Only set JSON content-type when the body is a JSON string.
  if (typeof init?.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const data = (await response.json()) as T & { ok?: boolean; error?: string };
  if (!response.ok || (data && 'ok' in data && data.ok === false)) {
    throw new Error(
      (data && 'error' in data && data.error) || `Request failed (${response.status})`,
    );
  }
  return data;
}

export async function persistSiteContent(content: SiteContent): Promise<{
  content: SiteContent;
  message?: string;
  git?: { committed?: boolean; sha?: string; reason?: string };
}> {
  assertNoEmbeddedImages(content);
  return adminFetch('/api/admin/content', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/**
 * Upload an image as raw binary to /public/images/{folder}/{filename}.ext
 * Returns the public path string to store in content JSON.
 */
export async function uploadAdminImage(payload: {
  file: Blob;
  folder?: string;
  filename?: string;
}): Promise<string> {
  assertImageWithinSizeLimit(payload.file);

  const params = new URLSearchParams({
    folder: payload.folder || 'uploads',
    filename: payload.filename || `image-${Date.now()}`,
  });

  const result = await adminFetch<{ url: string }>(
    `/api/admin/upload?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': payload.file.type || 'image/jpeg',
      },
      body: payload.file,
    },
  );
  return result.url;
}
