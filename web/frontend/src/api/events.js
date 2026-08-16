import { customApiUrl, wpApiUrl } from './wp';

const CUSTOM = customApiUrl('/events');
const FALLBACK = wpApiUrl('/wp-json/wp/v2/events');

const CACHE_TTL_MS = 2 * 60 * 1000;
const cache = new Map();

/** Coalesce identical in-flight GETs (StrictMode double mount, multiple blocks). */
const inflight = new Map();

function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

function formatWpDate(post) {
  const raw = post?.date || post?.modified || '';
  if (!raw) return '';
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function authorFromWp(post) {
  const emb = post?._embedded?.author?.[0];
  const name = emb?.name;
  if (typeof name === 'string' && name.trim() !== '') return name.trim();
  return '';
}

function normalizeWpV2Post(post) {
  const id = Number(post?.id || 0);
  const slug = String(post?.slug || '');
  const title = stripHtml(String(post?.title?.rendered || ''));
  const description = stripHtml(String(post?.excerpt?.rendered || post?.content?.rendered || ''));
  const imageUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const author = authorFromWp(post);
  const date = formatWpDate(post);
  return {
    id,
    slug,
    title,
    description,
    imageUrl,
    link: slug ? `/events/${slug}` : '#',
    date,
    author,
  };
}

function buildCustomUrl(categoryId, perPage) {
  const url = new URL(CUSTOM, window.location.origin);
  if (categoryId > 0) url.searchParams.set('category', String(categoryId));
  if (perPage > 0) url.searchParams.set('per_page', String(perPage));
  return url.pathname + url.search;
}

function buildFallbackUrl(categoryId, perPage) {
  const url = new URL(FALLBACK, window.location.origin);
  url.searchParams.set('_embed', '1');
  url.searchParams.set('orderby', 'date');
  url.searchParams.set('order', 'desc');
  const pp = perPage > 0 ? Math.min(perPage, 100) : 100;
  url.searchParams.set('per_page', String(pp));
  if (categoryId > 0) url.searchParams.set('categories', String(categoryId));
  return url.pathname + url.search;
}

function cacheKey(categoryId, perPage) {
  return `${categoryId}:${perPage > 0 ? perPage : 'all'}`;
}

/**
 * Fetch events: tries custom endpoint first (fast + cached server-side), then WP v2.
 * Uses short-lived in-memory cache and request deduplication.
 *
 * @param {{ categoryId?: number, limit?: number }} opts
 * @returns {Promise<Array<object>>}
 */
export async function fetchEventsList({ categoryId = 0, limit = 0 } = {}) {
  const cat = Math.max(0, Number(categoryId) || 0);
  const perPage = limit > 0 ? Math.min(100, Math.max(1, Math.floor(Number(limit)))) : 0;
  const key = cacheKey(cat, perPage);
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && Array.isArray(hit.data) && now - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }

  const inflightKey = `GET ${key}`;
  const existing = inflight.get(inflightKey);
  if (existing) return existing;

  const promise = (async () => {
    const customUrl = buildCustomUrl(cat, perPage);
    try {
      const res = await fetch(customUrl, {
        headers: { Accept: 'application/json' },
        cache: 'default',
      });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        const arr = Array.isArray(data) ? data : [];
        cache.set(key, { data: arr, at: Date.now() });
        return arr;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[events] custom endpoint failed', e);
    }

    const fallbackUrl = buildFallbackUrl(cat, perPage);
    const res = await fetch(fallbackUrl, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    });
    if (!res.ok) {
      throw new Error('Failed to load events');
    }
    const wpPosts = await res.json().catch(() => []);
    const arr = Array.isArray(wpPosts) ? wpPosts.map(normalizeWpV2Post) : [];
    cache.set(key, { data: arr, at: Date.now() });
    return arr;
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => {
    inflight.delete(inflightKey);
  });

  return promise;
}

/**
 * @param {string} slug
 */
export async function fetchEventPost(slug) {
  const clean = String(slug || '').trim().toLowerCase();
  if (!clean) throw new Error('Missing slug');

  const key = `post:${clean}`;
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && hit.data && now - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }

  const inflightKey = `GET event ${key}`;
  const existing = inflight.get(inflightKey);
  if (existing) return existing;

  const promise = (async () => {
    const customUrl = customApiUrl(`/events/${encodeURIComponent(clean)}`);
    try {
      const res = await fetch(customUrl, {
        headers: { Accept: 'application/json' },
        cache: 'default',
      });
      if (res.status === 404) {
        throw new Error('Not found');
      }
      if (res.ok) {
        const data = await res.json();
        cache.set(key, { data, at: Date.now() });
        return data;
      }
    } catch (e) {
      if (String(e?.message || '').toLowerCase().includes('not found')) {
        throw e;
      }
      // eslint-disable-next-line no-console
      console.error('[events] single custom endpoint failed', e);
    }

    const fallbackUrl = new URL(FALLBACK, window.location.origin);
    fallbackUrl.searchParams.set('slug', clean);
    fallbackUrl.searchParams.set('_embed', '1');
    fallbackUrl.searchParams.set('per_page', '1');
    const res = await fetch(fallbackUrl.pathname + fallbackUrl.search, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    });
    if (res.status === 404 || !res.ok) {
      throw new Error('Not found');
    }
    const arr = await res.json();
    const post = Array.isArray(arr) ? arr[0] : null;
    if (!post) throw new Error('Not found');
    const card = normalizeWpV2Post(post);
    const payload = { ...card, excerpt: card.description, blocks: [], navigation: { previous: null, next: null } };
    cache.set(key, { data: payload, at: Date.now() });
    return payload;
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => {
    inflight.delete(inflightKey);
  });

  return promise;
}
