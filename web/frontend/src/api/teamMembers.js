import { customApiUrl, wpApiUrl } from './wp';

const CUSTOM = customApiUrl('/team-members');
const FALLBACK = wpApiUrl('/wp-json/wp/v2/team-members');

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
  const name = stripHtml(String(post?.title?.rendered || ''));
  const excerpt = stripHtml(String(post?.excerpt?.rendered || post?.content?.rendered || ''));
  const bio = stripHtml(String(post?.content?.rendered || ''));
  const imageUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const position = String(post?.meta?.position || '').trim();
  const standAlone = Boolean(post?.meta?.standAlone);
  return { id, slug, name, position, standAlone, excerpt, bio, imageUrl };
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
  url.searchParams.set('orderby', 'menu_order');
  url.searchParams.set('order', 'asc');
  const pp = perPage > 0 ? Math.min(perPage, 100) : 100;
  url.searchParams.set('per_page', String(pp));
  if (categoryId > 0) url.searchParams.set('categories', String(categoryId));
  return url.pathname + url.search;
}

function cacheKey(categoryId, perPage) {
  return `${categoryId}:${perPage > 0 ? perPage : 'all'}`;
}

export async function fetchTeamMembersList({ categoryId = 0, limit = 0 } = {}) {
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
      const res = await fetch(customUrl, { headers: { Accept: 'application/json' }, cache: 'default' });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        const arr = Array.isArray(data) ? data : [];
        cache.set(key, { data: arr, at: Date.now() });
        return arr;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[teamMembers] custom endpoint failed', e);
    }

    const fallbackUrl = buildFallbackUrl(cat, perPage);
    const res = await fetch(fallbackUrl, { headers: { Accept: 'application/json' }, cache: 'default' });
    if (!res.ok) throw new Error('Failed to load team members');
    const wpPosts = await res.json().catch(() => []);
    const arr = Array.isArray(wpPosts) ? wpPosts.map(normalizeWpV2Post) : [];
    cache.set(key, { data: arr, at: Date.now() });
    return arr;
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => inflight.delete(inflightKey));
  return promise;
}

