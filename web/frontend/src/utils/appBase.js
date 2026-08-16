/** Vite `base` without trailing slash, e.g. "/frontend" or "" when served at site root. */
export function getAppBasePath() {
  const raw = import.meta.env.BASE_URL || '/';
  if (raw === '/' || raw === '') {
    return '';
  }
  return raw.replace(/\/$/, '');
}
