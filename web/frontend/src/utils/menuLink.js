/**
 * WordPress menu URL helpers for the React SPA (Vite base /frontend).
 */
import { getAppBasePath } from './appBase';
import { getWpHome } from './wpEnv';

/**
 * Site-relative path for router/API, e.g. /membership (no /frontend prefix).
 */
export function normalizeMenuPath(url) {
  const value = String(url || '').trim();
  if (!value || value === '#') {
    return '#';
  }

  if (/^(mailto:|tel:|javascript:)/i.test(value)) {
    return value;
  }

  let path = value;

  if (/^https?:\/\//i.test(value) || value.startsWith('//')) {
    try {
      const parsed = new URL(value, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const wpHome = getWpHome();

      if (wpHome) {
        const home = new URL(wpHome.endsWith('/') ? wpHome : `${wpHome}/`);
        if (parsed.origin === home.origin) {
          path = parsed.pathname + parsed.search + parsed.hash;
        } else {
          return value;
        }
      } else if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
        path = parsed.pathname + parsed.search + parsed.hash;
      } else {
        return value;
      }
    } catch {
      return value;
    }
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const base = getAppBasePath();
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/';
  }

  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path;
}

/** Path for React Router <Link to={…}> (basename adds /frontend). */
export function menuRouterPath(url) {
  return normalizeMenuPath(url);
}

/** Full href for <a> tags (includes /frontend when applicable). */
export function menuHref(url) {
  const path = normalizeMenuPath(url);
  if (path === '#' || /^https?:\/\//i.test(path) || /^(mailto:|tel:|javascript:)/i.test(path)) {
    return path;
  }

  const base = getAppBasePath();
  if (base) {
    return path === '/' ? `${base}/` : `${base}${path}`;
  }

  return path;
}

export function isExternalMenuUrl(url) {
  const value = String(url || '').trim();
  if (!value || value === '#') {
    return false;
  }
  if (/^(mailto:|tel:|javascript:)/i.test(value)) {
    return true;
  }
  const path = normalizeMenuPath(value);
  return /^https?:\/\//i.test(path);
}

export function normalizeMenuTarget(target) {
  const value = String(target || '').trim();
  if (!value) {
    return undefined;
  }
  if (value === '_blank' || value === 'blank') {
    return '_blank';
  }
  return value;
}

export function opensInNewTab(target) {
  return normalizeMenuTarget(target) === '_blank';
}

export function menuLinkRel(target) {
  return opensInNewTab(target) ? 'noopener noreferrer' : undefined;
}

/** React Router Link ignores target="_blank"; use a native anchor instead. */
export function shouldUseNativeAnchor(url, target) {
  return isExternalMenuUrl(url) || opensInNewTab(target);
}
