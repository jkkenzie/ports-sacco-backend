import { customApiUrl, wpApiUrl } from './wp';

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();
const inflight = new Map();

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

/**
 * @param {{ max?: number, channelId?: string }} opts
 */
export async function fetchYouTubeVideos({ max = 6, channelId = '' } = {}) {
  const limit = Math.min(12, Math.max(3, Number(max) || 6));
  const channel = String(channelId || '').trim();
  const key = `videos:${limit}:${channel}`;

  const cached = getCached(key);
  if (cached) return cached;

  const inflightKey = `GET ${key}`;
  if (inflight.has(inflightKey)) return inflight.get(inflightKey);

  const promise = (async () => {
    const url = new URL(customApiUrl('/youtube/videos'), window.location.origin);
    url.searchParams.set('max', String(limit));
    if (channel) url.searchParams.set('channel', channel);

    const res = await fetch(url.pathname + url.search, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    });

    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }

    const data = await res.json();
    const payload = {
      items: Array.isArray(data?.items) ? data.items : [],
      channel: data?.channel || { id: '', title: '', url: '' },
      error: typeof data?.error === 'string' ? data.error : '',
    };
    setCached(key, payload);
    return payload;
  })();

  inflight.set(inflightKey, promise);
  promise.finally(() => inflight.delete(inflightKey));
  return promise;
}
