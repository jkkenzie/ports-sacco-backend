import { customApiUrl } from '../api/wp';

let bootstrapPromise = null;

/**
 * Load public form bootstrap (nonce + optional Turnstile config).
 *
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<{ nonce: string, turnstileEnabled: boolean, turnstileSiteKey: string }>}
 */
export function loadFormBootstrap({ force = false } = {}) {
  if (force) {
    bootstrapPromise = null;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const url = customApiUrl('/nonce');
      const sep = url.includes('?') ? '&' : '?';
      const res = await fetch(`${url}${sep}_=${Date.now()}`, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
        cache: 'no-store',
      });
      const raw = await res.text();
      if (/cf-error-details|Sorry, you have been blocked|Attention Required!\s*\|\s*Cloudflare/i.test(raw)) {
        throw new Error('Request blocked by Cloudflare while loading the form.');
      }
      if (!res.ok) {
        throw new Error(`Failed to load form bootstrap (HTTP ${res.status})`);
      }
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error('Failed to load form bootstrap (invalid JSON)');
      }
      return {
        nonce: typeof data?.nonce === 'string' ? data.nonce : '',
        turnstileEnabled: Boolean(data?.turnstileEnabled),
        turnstileSiteKey: typeof data?.turnstileSiteKey === 'string' ? data.turnstileSiteKey.trim() : '',
      };
    })().catch((err) => {
      bootstrapPromise = null;
      throw err;
    });
  }
  return bootstrapPromise;
}

/**
 * @returns {Promise<{ enabled: boolean, siteKey: string }>}
 */
export async function resolveTurnstileConfig() {
  const boot = await loadFormBootstrap();
  const siteKey = String(boot.turnstileSiteKey || '').trim();
  const enabled = Boolean(boot.turnstileEnabled) && siteKey !== '';
  return { enabled, siteKey };
}
