import type { ImgHTMLAttributes } from 'react';

/**
 * Site images are plain <img> tags pointing at a Drive (or other) URL.
 * referrerPolicy helps Google Drive hotlinks load in the browser.
 */
export function CmsImage({
  alt = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} referrerPolicy="no-referrer" {...props} />;
}
