import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings2, X } from 'lucide-react';
import {
  COOKIE_CONSENT_CHOICE,
  COOKIE_CONSENT_MAX_AGE_DAYS,
  getCookieConsent,
  setCookieConsent,
} from '../utils/cookieConsent';

const TEAL = '#22acb6';
const ORANGE = '#ee6e2a';
const MUSEO = 'Museo900-Regular, Museo, sans-serif';
const BODY = 'sans-serif, Helvetica, sans-serif';

export function CookieConsentBanner() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing) {
      setChoice(existing.choice);
      setOpen(false);
    } else {
      setOpen(true);
    }
    setReady(true);

    const onConsent = (event) => {
      const next = event?.detail?.choice;
      if (next === COOKIE_CONSENT_CHOICE.ALL || next === COOKIE_CONSENT_CHOICE.NECESSARY) {
        setChoice(next);
        setOpen(false);
      } else if (next == null) {
        setChoice(null);
        setOpen(true);
      }
    };

    window.addEventListener('portsacco:cookie-consent', onConsent);
    return () => window.removeEventListener('portsacco:cookie-consent', onConsent);
  }, []);

  function acceptAll() {
    setCookieConsent(COOKIE_CONSENT_CHOICE.ALL);
    setChoice(COOKIE_CONSENT_CHOICE.ALL);
    setOpen(false);
  }

  function acceptNecessary() {
    setCookieConsent(COOKIE_CONSENT_CHOICE.NECESSARY);
    setChoice(COOKIE_CONSENT_CHOICE.NECESSARY);
    setOpen(false);
  }

  function reopenPreferences() {
    setOpen(true);
  }

  if (!ready) return null;

  return (
    <>
      {!open && choice ? (
        <button
          type="button"
          onClick={reopenPreferences}
          className="fixed bottom-4 left-4 z-[70] inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1e293b] shadow-lg transition hover:border-[#22acb6] hover:text-[#22acb6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22acb6]"
          style={{ fontFamily: BODY }}
          aria-label="Open cookie preferences"
        >
          <Settings2 className="size-4" strokeWidth={2} aria-hidden />
          Cookies
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-5"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div
            className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_-8px_40px_rgba(15,23,42,0.14)] sm:flex-row sm:items-end sm:gap-6 sm:p-5"
            style={{ fontFamily: BODY }}
          >
            <div className="flex min-w-0 flex-1 gap-3">
              <span
                className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: TEAL }}
                aria-hidden
              >
                <Cookie className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h2
                    id="cookie-consent-title"
                    className="text-base font-bold text-[#1e293b] sm:text-lg"
                    style={{ fontFamily: MUSEO }}
                  >
                    We use cookies
                  </h2>
                  {choice ? (
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full p-1 text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                      aria-label="Close cookie preferences"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>
                <p id="cookie-consent-desc" className="text-sm leading-relaxed text-[#475569] sm:text-[15px]">
                  We use essential cookies to make our site work. With your consent, we also use analytics and
                  social media cookies to improve our Services. You can change your choice anytime. See our{' '}
                  <Link
                    to="/cookie-policy"
                    className="font-semibold underline underline-offset-2"
                    style={{ color: TEAL }}
                  >
                    Cookie Policy
                  </Link>{' '}
                  for details. Your preference is remembered for {COOKIE_CONSENT_MAX_AGE_DAYS} days.
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[240px]">
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-95"
                style={{ backgroundColor: TEAL, fontFamily: MUSEO }}
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={acceptNecessary}
                className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition hover:border-[#22acb6] hover:text-[#22acb6]"
                style={{ borderColor: '#cbd5e1', color: '#1e293b', fontFamily: MUSEO }}
              >
                Necessary only
              </button>
              <p className="text-center text-[11px] text-[#94a3b8]">
                Essential cookies always run. Analytics need consent.
                {choice ? (
                  <>
                    {' '}
                    Current:{' '}
                    <span style={{ color: choice === COOKIE_CONSENT_CHOICE.ALL ? TEAL : ORANGE }}>
                      {choice === COOKIE_CONSENT_CHOICE.ALL ? 'Accept all' : 'Necessary only'}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
