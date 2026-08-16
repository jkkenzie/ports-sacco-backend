import { resolveTurnstileConfig } from '../api/formBootstrap';

let turnstileScriptPromise = null;

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('No window'));
  }
  if (window.turnstile && typeof window.turnstile.render === 'function') {
    return Promise.resolve(window.turnstile);
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-turnstile="1"]');
    if (existing) {
      const wait = () => {
        if (window.turnstile && typeof window.turnstile.render === 'function') {
          resolve(window.turnstile);
          return;
        }
        window.setTimeout(wait, 40);
      };
      existing.addEventListener('error', () => {
        turnstileScriptPromise = null;
        reject(new Error('Turnstile failed to load'));
      });
      wait();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-turnstile', '1');
    script.onload = () => {
      if (window.turnstile && typeof window.turnstile.render === 'function') {
        resolve(window.turnstile);
        return;
      }
      turnstileScriptPromise = null;
      reject(new Error('Turnstile unavailable'));
    };
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

/**
 * Prefetch Turnstile only when enabled in WP.
 */
export async function ensureTurnstileReady() {
  const cfg = await resolveTurnstileConfig();
  if (!cfg.enabled || !cfg.siteKey) {
    return null;
  }
  return loadTurnstileScript();
}

/**
 * Returns a Turnstile token when enabled; empty string when disabled.
 */
export async function getTurnstileToken({ action } = {}) {
  const cfg = await resolveTurnstileConfig();
  if (!cfg.enabled || !cfg.siteKey) {
    return '';
  }

  const turnstile = await loadTurnstileScript();
  if (!turnstile || typeof turnstile.render !== 'function') {
    throw new Error('Turnstile unavailable');
  }

  return new Promise((resolve, reject) => {
    const host = document.createElement('div');
    host.setAttribute('data-turnstile-host', '1');
    // Keep on-screen so interaction-only challenges are visible when required.
    host.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483000;';
    document.body.appendChild(host);

    let settled = false;
    let widgetId = null;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      try {
        if (widgetId != null && typeof turnstile.remove === 'function') {
          turnstile.remove(widgetId);
        }
      } catch {
        /* ignore */
      }
      host.remove();
      fn(value);
    };

    const timer = window.setTimeout(() => {
      finish(reject, new Error('Turnstile timed out'));
    }, 20000);

    try {
      widgetId = turnstile.render(host, {
        sitekey: cfg.siteKey,
        action: action || 'submit',
        appearance: 'interaction-only',
        callback: (token) => {
          if (!token || typeof token !== 'string') {
            finish(reject, new Error('Failed to get Turnstile token'));
            return;
          }
          finish(resolve, token);
        },
        'error-callback': () => finish(reject, new Error('Turnstile verification failed')),
        'timeout-callback': () => finish(reject, new Error('Turnstile timed out')),
        'expired-callback': () => {
          try {
            if (widgetId != null) turnstile.reset(widgetId);
          } catch {
            /* ignore */
          }
        },
      });
    } catch (err) {
      finish(reject, err instanceof Error ? err : new Error('Turnstile failed'));
    }
  });
}
