/**
 * POST JSON to a WordPress REST route with wp_rest nonce + cookies.
 */
export async function postJsonWithNonce(url, payload, nonce) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = typeof nonce === 'string' ? nonce.trim() : '';
  if (token) {
    headers['X-WP-Nonce'] = token;
  }

  const body =
    token && payload && typeof payload === 'object' && !Array.isArray(payload)
      ? { ...payload, _wpnonce: token }
      : payload;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify(body ?? {}),
  });

  const raw = await res.text();
  const data = parseJsonOrCloudflare(raw, res);

  if (!res.ok || data?.code === 'cloudflare_blocked') {
    const err = new Error(extractRestMessage(data) || `HTTP ${res.status}`);
    err.status = res.status || 403;
    err.data = data;
    err.code = typeof data?.code === 'string' ? data.code : '';
    throw err;
  }

  return data;
}

function parseJsonOrCloudflare(raw, res) {
  const text = String(raw || '');
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    if (isCloudflareBlockHtml(text)) {
      const ray = extractCloudflareRayId(text);
      return {
        code: 'cloudflare_blocked',
        message: ray
          ? `Request blocked by Cloudflare (Ray ID ${ray}).`
          : 'Request blocked by Cloudflare.',
        data: { status: res?.status || 403, rayId: ray },
      };
    }
    return {};
  }
}

function isCloudflareBlockHtml(text) {
  return (
    /cf-error-details|Attention Required!\s*\|\s*Cloudflare|Sorry, you have been blocked|cdn-cgi\/styles\/cf\.errors/i.test(
      text
    )
  );
}

function extractCloudflareRayId(text) {
  const match = String(text || '').match(/Cloudflare Ray ID:\s*<strong[^>]*>([a-f0-9]+)<\/strong>/i);
  return match?.[1] || '';
}

function stripTags(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractRestMessage(data) {
  if (!data || typeof data !== 'object') return '';
  if (typeof data.message === 'string' && data.message.trim()) {
    return stripTags(data.message);
  }
  if (data.data && typeof data.data === 'object' && typeof data.data.message === 'string') {
    return stripTags(data.data.message);
  }
  return '';
}

export function formSubmitErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const code = String(err?.code || err?.data?.code || '');
  const status = Number(err?.status) || 0;
  const apiMessage = extractRestMessage(err?.data) || (typeof err?.message === 'string' ? stripTags(err.message) : '');

  if (code === 'cloudflare_blocked' || /blocked by Cloudflare/i.test(apiMessage)) {
    return 'Your request was blocked by the site firewall. Please try again in a moment, or contact us by phone/email if it keeps happening.';
  }
  if (code === 'headless_mail_failed' || (status === 500 && code.includes('mail'))) {
    return apiMessage || 'Unable to send email right now. Please try again later or call us.';
  }
  if (
    code === 'headless_turnstile_required' ||
    code === 'headless_turnstile_failed' ||
    code === 'headless_turnstile_misconfigured' ||
    code === 'headless_turnstile_unavailable' ||
    code === 'headless_recaptcha_required' ||
    code === 'headless_recaptcha_failed' ||
    code === 'headless_recaptcha_misconfigured' ||
    code === 'headless_recaptcha_unavailable'
  ) {
    return 'Security verification failed. Please refresh the page and try again.';
  }
  if (code === 'rest_cookie_invalid_nonce' || status === 403) {
    return 'Unable to verify the form. Please refresh the page and try again.';
  }
  if (code === 'headless_rate_limited' || status === 429) {
    return 'Too many attempts. Please wait and try again.';
  }
  if (code === 'headless_invalid' || code === 'headless_invalid_email' || status === 400) {
    return apiMessage || 'Please check your details and try again.';
  }
  if (apiMessage && !/^HTTP \d+/i.test(apiMessage) && !/Missing VITE_/i.test(apiMessage)) {
    return apiMessage;
  }
  if (/Turnstile|reCAPTCHA|Missing VITE_RECAPTCHA/i.test(String(err?.message || ''))) {
    return 'Security verification failed. Please refresh the page and try again.';
  }
  return fallback;
}
