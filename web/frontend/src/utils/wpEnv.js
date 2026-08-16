/**
 * WordPress site URL baked in at build time from WP_HOME (Bedrock .env).
 * Falls back to current origin only when unset (e.g. misconfigured build).
 */
export function getWpHome() {
  const fromEnv = String(import.meta.env.VITE_WP_HOME || '').replace(/\/$/, '');
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

export function wpAbsoluteUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const home = getWpHome();
  if (home) {
    return `${home}${p}`;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${p}`;
  }
  return p;
}
