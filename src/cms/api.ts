import { ADMIN_API_TOKEN } from '@/cms/defaults';
import type { SiteContent } from '@/types/cms';

async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': ADMIN_API_TOKEN,
      ...(init?.headers ?? {}),
    },
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
  return adminFetch('/api/admin/content', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function uploadAdminImage(payload: {
  dataUrl: string;
  folder?: string;
  filename?: string;
}): Promise<string> {
  const result = await adminFetch<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.url;
}
