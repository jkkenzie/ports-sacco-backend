import { customApiUrl, wpApiUrl } from './wp';
import { postJsonWithNonce } from './postJsonWithNonce';

const NEWS_BASE = customApiUrl('/news');
const WP_POSTS = wpApiUrl('/wp-json/wp/v2/posts');

const CACHE_TTL_MS = 2 * 60 * 1000;
const cache = new Map();
const inflight = new Map();

function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

function cacheKey(parts) {
  return Object.entries(parts)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
}

function getCached(key) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, at: Date.now() });
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'default',
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

function buildArchiveUrl({ categoryId, page, perPage }) {
  const url = new URL(NEWS_BASE, window.location.origin);
  if (categoryId > 0) url.searchParams.set('category', String(categoryId));
  if (page > 1) url.searchParams.set('page', String(page));
  if (perPage > 0) url.searchParams.set('per_page', String(perPage));
  return url.pathname + url.search;
}

function normalizeWpCategory(term) {
  return {
    id: Number(term?.id || 0),
    name: String(term?.name || ''),
    slug: String(term?.slug || ''),
    count: Number(term?.count || 0),
  };
}

function isExcludedNewsFilterCategory(term) {
  const slug = String(term?.slug || '').toLowerCase();
  const name = String(term?.name || '').toLowerCase();
  return slug === 'uncategorized' || name === 'uncategorized';
}

function filterNewsCategories(list) {
  if (!Array.isArray(list)) return [{ id: 0, name: 'All', slug: '', count: 0 }];
  return list.filter((term) => {
    const id = Number(term?.id) || 0;
    if (id === 0) return true;
    return !isExcludedNewsFilterCategory(term);
  });
}

function normalizeWpPostCard(post) {
  const id = Number(post?.id || 0);
  const slug = String(post?.slug || '');
  const title = stripHtml(String(post?.title?.rendered || ''));
  const excerpt = stripHtml(String(post?.excerpt?.rendered || ''));
  const imageUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const author = post?._embedded?.author?.[0]?.name || '';
  const terms = post?._embedded?.['wp:term']?.[0];
  const categories = Array.isArray(terms) ? terms.map(normalizeWpCategory) : [];
  const primaryCategory = categories[0] || null;

  return {
    id,
    slug,
    title,
    excerpt,
    description: excerpt,
    imageUrl,
    author,
    commentCount: Number(post?.comment_count || 0),
    categories,
    primaryCategory,
    date: post?.date
      ? new Date(String(post.date)).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
    link: slug ? `/news/${slug}` : '#',
  };
}

/**
 * @returns {Promise<Array<{ id: number, name: string, slug: string, count: number }>>}
 */
export async function fetchNewsCategories() {
  const key = 'categories';
  const cached = getCached(key);
  if (cached) return cached;

  const inflightKey = `GET ${key}`;
  if (inflight.has(inflightKey)) return inflight.get(inflightKey);

  const promise = (async () => {
    try {
      const data = await fetchJson(customApiUrl('/news/categories'));
      const arr = filterNewsCategories(Array.isArray(data) ? data : []);
      setCached(key, arr);
      return arr;
    } catch (e) {
      const postsUrl = new URL(wpApiUrl('/wp-json/wp/v2/posts'), window.location.origin);
      postsUrl.searchParams.set('per_page', '100');
      postsUrl.searchParams.set('status', 'publish');
      postsUrl.searchParams.set('_fields', 'categories');
      const posts = await fetchJson(postsUrl.pathname + postsUrl.search);
      const categoryIds = new Set();
      if (Array.isArray(posts)) {
        posts.forEach((post) => {
          const cats = Array.isArray(post?.categories) ? post.categories : [];
          cats.forEach((id) => categoryIds.add(Number(id)));
        });
      }

      const termsUrl = new URL(wpApiUrl('/wp-json/wp/v2/categories'), window.location.origin);
      termsUrl.searchParams.set('per_page', '100');
      termsUrl.searchParams.set('include', [...categoryIds].filter(Boolean).join(','));
      const terms = categoryIds.size
        ? await fetchJson(termsUrl.pathname + termsUrl.search)
        : [];
      const arr = filterNewsCategories([
        { id: 0, name: 'All', slug: '', count: Array.isArray(posts) ? posts.length : 0 },
        ...(Array.isArray(terms) ? terms.map(normalizeWpCategory) : []),
      ]);
      setCached(key, arr);
      return arr;
    }
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => inflight.delete(inflightKey));
  return promise;
}

/**
 * @param {{ categoryId?: number, page?: number, perPage?: number }} opts
 * @returns {Promise<{ items: object[], pagination: object }>}
 */
export async function fetchNewsArchive({ categoryId = 0, page = 1, perPage = 9 } = {}) {
  const cat = Math.max(0, Number(categoryId) || 0);
  const pg = Math.max(1, Number(page) || 1);
  const pp = Math.min(24, Math.max(1, Number(perPage) || 9));
  const key = cacheKey({ cat, pg, pp });
  const cached = getCached(key);
  if (cached) return cached;

  const inflightKey = `GET archive ${key}`;
  if (inflight.has(inflightKey)) return inflight.get(inflightKey);

  const promise = (async () => {
    try {
      const data = await fetchJson(buildArchiveUrl({ categoryId: cat, page: pg, perPage: pp }));
      const payload = {
        items: Array.isArray(data?.items) ? data.items : [],
        pagination: data?.pagination || { page: pg, perPage: pp, total: 0, totalPages: 1 },
      };
      setCached(key, payload);
      return payload;
    } catch (e) {
      const url = new URL(WP_POSTS, window.location.origin);
      url.searchParams.set('_embed', '1');
      url.searchParams.set('per_page', String(pp));
      url.searchParams.set('page', String(pg));
      url.searchParams.set('orderby', 'date');
      url.searchParams.set('order', 'desc');
      if (cat > 0) url.searchParams.set('categories', String(cat));

      const res = await fetch(url.pathname + url.search, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to load news');

      const posts = await res.json();
      const total = Number(res.headers.get('X-WP-Total') || 0);
      const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1);
      const payload = {
        items: Array.isArray(posts) ? posts.map(normalizeWpPostCard) : [],
        pagination: { page: pg, perPage: pp, total, totalPages: Math.max(1, totalPages) },
      };
      setCached(key, payload);
      return payload;
    }
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => inflight.delete(inflightKey));
  return promise;
}

/**
 * @param {string} slug
 */
export async function fetchNewsPost(slug) {
  const clean = String(slug || '').trim().toLowerCase();
  if (!clean) throw new Error('Missing slug');

  const key = `post:${clean}`;
  const cached = getCached(key);
  if (cached) return cached;

  const inflightKey = `GET ${key}`;
  if (inflight.has(inflightKey)) return inflight.get(inflightKey);

  const promise = (async () => {
    try {
      const data = await fetchJson(`${NEWS_BASE}/${encodeURIComponent(clean)}`);
      setCached(key, data);
      return data;
    } catch (e) {
      const url = new URL(WP_POSTS, window.location.origin);
      url.searchParams.set('slug', clean);
      url.searchParams.set('_embed', '1');
      url.searchParams.set('per_page', '1');
      const arr = await fetchJson(url.pathname + url.search);
      const post = Array.isArray(arr) ? arr[0] : null;
      if (!post) throw new Error('Not found');
      const card = normalizeWpPostCard(post);
      const payload = { ...card, blocks: [] };
      setCached(key, payload);
      return payload;
    }
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => inflight.delete(inflightKey));
  return promise;
}

/**
 * @param {string} slug
 * @param {{ name: string, email: string, comment: string, _gotcha?: string, _wpnonce?: string }} payload
 * @param {string} nonce
 */
export async function submitNewsComment(slug, payload, nonce) {
  const clean = String(slug || '').trim().toLowerCase();
  if (!clean) throw new Error('Missing slug');

  return postJsonWithNonce(
    customApiUrl(`/news/${encodeURIComponent(clean)}/comments`),
    payload,
    nonce
  );
}
