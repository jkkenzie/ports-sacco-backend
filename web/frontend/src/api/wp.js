/**
 * WordPress REST base URL.
 * Default: empty string = same-origin `/wp-json` (Vite proxy on localhost:4173, WAMP on ports-sacco).
 * Set VITE_WP_API_BASE only when the API is on a different host in production.
 */
export function wpApiBase() {
  return (import.meta.env.VITE_WP_API_BASE || '').replace(/\/$/, '');
}

/** Primary headless REST namespace (legacy /custom/v1 still aliased server-side). */
export const WP_CUSTOM_API = '/wp-json/portsacco/v1';

/**
 * Build a URL under the Ports SACCO headless REST namespace.
 * @param {string} path e.g. '/contact' or 'news/categories'
 */
export function customApiUrl(path = '') {
  const suffix = String(path || '');
  const normalized = suffix === '' ? '' : suffix.startsWith('/') ? suffix : `/${suffix}`;
  return wpApiUrl(`${WP_CUSTOM_API}${normalized}`);
}

export function wpApiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = wpApiBase();
  let url = `${base}${p}`;

  if (import.meta.env.VITE_WP_FRESH_API === 'true') {
    const sep = url.includes('?') ? '&' : '?';
    url = `${url}${sep}_=${Date.now()}`;
  }

  return url;
}

export function wpFetchInit(extra = {}) {
  return {
    cache: 'no-store',
    headers: { Accept: 'application/json', ...(extra.headers || {}) },
    ...extra,
  };
}

/**
 * Normalize REST page payload — ensure blocks is always an array.
 */
export function normalizePagePayload(data) {
  if (!data || typeof data !== 'object') {
    return { slug: '', title: '', blocks: [] };
  }

  const blocks = Array.isArray(data.blocks) ? data.blocks : [];

  return {
    slug: typeof data.slug === 'string' ? data.slug : '',
    title: typeof data.title === 'string' ? data.title : '',
    blocks: blocks.map((block) => {
      if (!block || typeof block !== 'object') {
        return { name: '', attributes: {}, innerBlocks: [] };
      }
      const attrs = block.attributes;
      const normalizedAttrs =
        attrs && typeof attrs === 'object' && !Array.isArray(attrs) ? { ...attrs } : {};

      return {
        name: typeof block.name === 'string' ? block.name : '',
        attributes: normalizedAttrs,
        innerBlocks: Array.isArray(block.innerBlocks) ? block.innerBlocks : [],
      };
    }),
  };
}

/**
 * @param {string} slug Route slug without leading slash (e.g. home, membership, services)
 */
export async function fetchPageBySlug(slug) {
  const url =
    !slug || slug === 'home'
      ? customApiUrl('/page')
      : customApiUrl(`/page/${slug.split('/').map(encodeURIComponent).join('/')}`);

  let res;
  try {
    res = await fetch(url, wpFetchInit());
  } catch (err) {
    console.error('[fetchPageBySlug] Network error', { slug, url, err });
    return { ok: false, status: 0, data: null, error: err?.message || 'Network error' };
  }

  if (res.status === 404) {
    return { ok: false, status: 404, data: null };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[fetchPageBySlug] HTTP error', { slug, url, status: res.status, body: text.slice(0, 300) });
    return { ok: false, status: res.status, data: null };
  }

  let raw;
  try {
    raw = await res.json();
  } catch (err) {
    const text = await res.text().catch(() => '');
    console.error('[fetchPageBySlug] JSON parse error', { slug, url, err, body: text.slice(0, 300) });
    return { ok: false, status: res.status, data: null, error: err?.message || 'Invalid JSON' };
  }

  const data = normalizePagePayload(raw);

  if (import.meta.env.DEV) {
    console.info('[fetchPageBySlug] OK', { slug, url, blockCount: data.blocks.length });
  }

  return { ok: true, status: res.status, data };
}

export async function fetchMenuByLocation(location) {
  const url = customApiUrl(`/menu/${encodeURIComponent(location)}`);

  try {
    const res = await fetch(url, wpFetchInit());
    if (!res.ok) {
      return { ok: false, status: res.status, items: [] };
    }
    const items = await res.json();
    return { ok: true, status: res.status, items: Array.isArray(items) ? items : [] };
  } catch {
    return { ok: false, status: 0, items: [] };
  }
}
