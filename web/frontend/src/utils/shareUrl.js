import { getAppBasePath } from './appBase';

export function buildNewsPostShareUrl(post) {
  const share = post?.share || {};
  const path = share.path || post?.link || (post?.slug ? `/news/${post.slug}` : '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getAppBasePath();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${base}${normalized}`;
}

export function buildEventPostShareUrl(post) {
  const share = post?.share || {};
  const path = share.path || post?.link || (post?.slug ? `/events/${post.slug}` : '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getAppBasePath();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${base}${normalized}`;
}

export function buildShareLinks({ url, title, description }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');
  const encodedText = encodeURIComponent(
    [title, description].filter(Boolean).join(' — ').trim() || title || url
  );

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title ? `${title} ` : ''}${url}`)}`,
    instagram: url,
    copyText: `${title ? `${title}\n` : ''}${url}`,
    encodedText,
  };
}
