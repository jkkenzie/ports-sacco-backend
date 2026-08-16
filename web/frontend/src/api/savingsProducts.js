import { customApiUrl, wpApiUrl } from './wp';

const CUSTOM = customApiUrl('/savings-products');
const FALLBACK = wpApiUrl('/wp-json/wp/v2/savings-products');

const CACHE_TTL_MS = 2 * 60 * 1000;
const cache = new Map();
const inflight = new Map();

function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

function normalizeWpV2Post(post) {
  const id = Number(post?.id || 0);
  const slug = String(post?.slug || '');
  const title = stripHtml(String(post?.title?.rendered || ''));
  const description = stripHtml(String(post?.excerpt?.rendered || post?.content?.rendered || ''));
  const imageUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  return {
    id,
    slug,
    title,
    description,
    imageUrl,
    link: slug ? `/savings-products/${slug}` : '#',
  };
}

function buildCustomUrl(perPage) {
  const url = new URL(CUSTOM, window.location.origin);
  if (perPage > 0) url.searchParams.set('per_page', String(perPage));
  return url.pathname + url.search;
}

function buildFallbackUrl(perPage) {
  const url = new URL(FALLBACK, window.location.origin);
  url.searchParams.set('_embed', '1');
  url.searchParams.set('orderby', 'date');
  url.searchParams.set('order', 'asc');
  const pp = perPage > 0 ? Math.min(perPage, 100) : 100;
  url.searchParams.set('per_page', String(pp));
  return url.pathname + url.search;
}

function cacheKey(perPage) {
  return perPage > 0 ? perPage : 'all';
}

/**
 * @param {{ limit?: number }} opts — limit 0 = all posts (server may still cap fallback at 100)
 * @returns {Promise<Array<object>>}
 */
export async function fetchSavingsProductsList({ limit = 0 } = {}) {
  const perPage = limit > 0 ? Math.min(100, Math.max(1, Math.floor(Number(limit)))) : 0;
  const key = cacheKey(perPage);
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && Array.isArray(hit.data) && now - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }

  const inflightKey = `savings GET ${key}`;
  const existing = inflight.get(inflightKey);
  if (existing) return existing;

  const promise = (async () => {
    const customUrl = buildCustomUrl(perPage);
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
      console.error('[savingsProducts] custom endpoint failed', e);
    }

    const fallbackUrl = buildFallbackUrl(perPage);
    const res = await fetch(fallbackUrl, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    });
    if (!res.ok) {
      throw new Error('Failed to load savings products');
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
