import { useCallback, useEffect, useRef } from 'react';
import { loadFormBootstrap } from '../api/formBootstrap';
import { ensureTurnstileReady } from '../utils/turnstile';

/**
 * Fetch a fresh wp_rest nonce on mount (stored in ref for submit).
 * Prefetches Turnstile only when WP has it enabled.
 *
 * @returns {{ nonceRef: import('react').MutableRefObject<string>, ensureNonce: (opts?: { force?: boolean }) => Promise<string> }}
 */
export function useFormNonce() {
  const nonceRef = useRef('');

  const ensureNonce = useCallback(async ({ force = false } = {}) => {
    const data = await loadFormBootstrap({ force });
    nonceRef.current = data?.nonce || '';
    return nonceRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await loadFormBootstrap();
        if (cancelled) return;
        nonceRef.current = data?.nonce || '';
        if (data?.turnstileEnabled && data?.turnstileSiteKey) {
          ensureTurnstileReady().catch(() => {
            /* submit path will surface a clear error if still needed */
          });
        }
      } catch {
        /* submit will fail with 403 */
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { nonceRef, ensureNonce };
}
