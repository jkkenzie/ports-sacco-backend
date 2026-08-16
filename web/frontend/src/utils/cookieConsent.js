/**
 * Cookie consent preference storage (localStorage + first-party cookie).
 * Consent is valid for CONSENT_MAX_AGE_DAYS unless cleared or expired.
 */

export const COOKIE_CONSENT_STORAGE_KEY = 'portsacco_cookie_consent';
export const COOKIE_CONSENT_COOKIE_NAME = 'portsacco_cookie_consent';
export const COOKIE_CONSENT_VERSION = 1;
/** Standard retention window for cookie preference prompts (1 year). */
export const COOKIE_CONSENT_MAX_AGE_DAYS = 365;

export const COOKIE_CONSENT_CHOICE = {
  ALL: 'all',
  NECESSARY: 'necessary',
};

function daysToMs(days) {
  return days * 24 * 60 * 60 * 1000;
}

function safeParse(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const parts = String(document.cookie || '').split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${name}=`)) continue;
    return decodeURIComponent(trimmed.slice(name.length + 1));
  }
  return null;
}

function writeCookie(name, value, maxAgeSeconds) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function isRecordValid(record) {
  if (!record || typeof record !== 'object') return false;
  if (Number(record.version) !== COOKIE_CONSENT_VERSION) return false;
  const choice = String(record.choice || '');
  if (choice !== COOKIE_CONSENT_CHOICE.ALL && choice !== COOKIE_CONSENT_CHOICE.NECESSARY) {
    return false;
  }
  const expiresAt = Number(record.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  return true;
}

function readStoredRaw() {
  if (typeof window === 'undefined') return null;
  try {
    const fromStorage = window.localStorage?.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (fromStorage) return fromStorage;
  } catch {
    // private mode / blocked storage
  }
  return readCookie(COOKIE_CONSENT_COOKIE_NAME);
}

/**
 * @returns {{ version: number, choice: 'all'|'necessary', updatedAt: number, expiresAt: number } | null}
 */
export function getCookieConsent() {
  const raw = readStoredRaw();
  if (!raw) return null;
  const record = safeParse(raw);
  if (!isRecordValid(record)) return null;
  return {
    version: COOKIE_CONSENT_VERSION,
    choice: record.choice,
    updatedAt: Number(record.updatedAt) || Date.now(),
    expiresAt: Number(record.expiresAt),
  };
}

export function hasValidCookieConsent() {
  return getCookieConsent() != null;
}

/**
 * @param {'all'|'necessary'} choice
 */
export function setCookieConsent(choice) {
  const normalized =
    choice === COOKIE_CONSENT_CHOICE.ALL ? COOKIE_CONSENT_CHOICE.ALL : COOKIE_CONSENT_CHOICE.NECESSARY;
  const now = Date.now();
  const record = {
    version: COOKIE_CONSENT_VERSION,
    choice: normalized,
    updatedAt: now,
    expiresAt: now + daysToMs(COOKIE_CONSENT_MAX_AGE_DAYS),
  };
  const payload = JSON.stringify(record);
  const maxAgeSeconds = COOKIE_CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

  try {
    window.localStorage?.setItem(COOKIE_CONSENT_STORAGE_KEY, payload);
  } catch {
    // fall through to cookie-only
  }
  writeCookie(COOKIE_CONSENT_COOKIE_NAME, payload, maxAgeSeconds);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('portsacco:cookie-consent', {
        detail: { choice: normalized, record },
      })
    );
  }

  return record;
}

export function clearCookieConsent() {
  try {
    window.localStorage?.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
  clearCookie(COOKIE_CONSENT_COOKIE_NAME);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('portsacco:cookie-consent', { detail: { choice: null } }));
  }
}

export function allowsAnalyticsCookies() {
  return getCookieConsent()?.choice === COOKIE_CONSENT_CHOICE.ALL;
}
