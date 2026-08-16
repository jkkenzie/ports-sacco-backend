import React, { useEffect, useState } from 'react';

const TEAL = '#00AFBB';
const ORANGE = '#EE6E2A';

const DEFAULT_ITEMS = [
  {
    title: 'APPLY FOR A LOAN',
    description: 'Looking to buy a car, build a home, start a business, pay for education? Apply for a loan now!',
    linkMode: 'text',
    linkText: 'Get an Appointment',
    linkUrl: '',
  },
  {
    title: 'CALL US!',
    description: '+254 111 173 000 info@portsacco.co.ke',
    linkMode: 'text',
    linkText: 'Contact us',
    linkUrl: '',
  },
  {
    title: 'TALK TO AN ADVISOR',
    description: 'Do you need financial planning? Talk to our advisors.',
    linkMode: 'svg',
    linkText: '',
    linkUrl: '',
  },
];

function normalizeItems(items) {
  const saved = Array.isArray(items) ? items : [];
  const count = Math.max(DEFAULT_ITEMS.length, saved.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = DEFAULT_ITEMS[i] || { title: '', description: '', linkMode: 'text', linkText: '', linkUrl: '' };
    const s = saved[i] && typeof saved[i] === 'object' ? saved[i] : {};
    out.push({
      title: String(s.title ?? '').trim() || d.title,
      description: String(s.description ?? '').trim() || d.description,
      linkMode: (String(s.linkMode ?? d.linkMode).toLowerCase() === 'svg' ? 'svg' : 'text'),
      linkText: String(s.linkText ?? '').trim() || d.linkText,
      linkUrl: String(s.linkUrl ?? '').trim() || d.linkUrl,
      iconUrl: typeof s.iconUrl === 'string' ? s.iconUrl : '',
      iconSvg: typeof s.iconSvg === 'string' ? s.iconSvg : '',
      linkSvgUrl: typeof s.linkSvgUrl === 'string' ? s.linkSvgUrl : '',
      linkSvgMarkup: typeof s.linkSvgMarkup === 'string' ? s.linkSvgMarkup : '',
    });
  }
  return out;
}

function isSvgUrl(url) {
  if (typeof url !== 'string' || !url) return false;
  const clean = url.split('?')[0].split('#')[0];
  return clean.toLowerCase().endsWith('.svg');
}

function descriptionPlainLines(html) {
  if (typeof html !== 'string') return [];
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
  return withBreaks;
}

function renderDescription(card) {
  const title = String(card.title || '').toUpperCase();
  if (title.includes('CALL US')) {
    const lines = descriptionPlainLines(card.description);
    const phone = lines[0] || '';
    const email = lines[1] || '';
    return (
      <>
        {phone ? (
          <p className="font-bold text-base mb-1" style={{ color: '#808080' }}>
            {phone}
          </p>
        ) : null}
        {email ? (
          <p className="text-sm mb-4" style={{ color: '#808080' }}>
            {email}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <div
      className="text-sm leading-relaxed mb-4"
      style={{ color: '#000000' }}
      dangerouslySetInnerHTML={{ __html: card.description }}
    />
  );
}

function InlineSvg({ markup, url, forceCurrentColor = true }) {
  const [svgMarkup, setSvgMarkup] = useState(markup || '');

  useEffect(() => {
    let cancelled = false;
    if (svgMarkup || !isSvgUrl(url)) return () => {};
    fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then((txt) => {
        if (!cancelled && typeof txt === 'string' && txt.includes('<svg')) {
          setSvgMarkup(txt);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, svgMarkup]);

  if (!svgMarkup) return null;
  if (!forceCurrentColor) {
    return <span aria-hidden dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
  }
  const normalizedMarkup = svgMarkup
    .replace(/fill\s*=\s*(['"]).*?\1/gi, 'fill="currentColor"')
    .replace(/style\s*=\s*(['"])(.*?)\1/gi, function (_, q, css) {
      var nextCss = String(css).replace(/fill\s*:\s*[^;]+;?/gi, '').trim();
      return 'style=' + q + (nextCss ? nextCss + '; ' : '') + 'fill: currentColor;' + q;
    });
  const finalMarkup = normalizedMarkup.includes('<svg') && !/fill\s*=/.test(normalizedMarkup)
    ? normalizedMarkup.replace('<svg', '<svg fill="currentColor"')
    : normalizedMarkup;
  return <span aria-hidden dangerouslySetInnerHTML={{ __html: finalMarkup }} />;
}

export function AboutUsHelpBlock({ items, iconColor = ORANGE, linkSvgColor = TEAL, headerText = 'WE ARE HERE TO HELP YOU', ctaText = 'TALK TO US!' }) {
  const cards = normalizeItems(items);
  const resolvedIconColor = typeof iconColor === 'string' && iconColor.trim() ? iconColor : ORANGE;
  const resolvedLinkSvgColor = typeof linkSvgColor === 'string' && linkSvgColor.trim() ? linkSvgColor : TEAL;

  return (
    <div className="max-w-full mx-auto px-0 py-12 mb-8 lg:mb-10" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
      <style>{`
        .about-us-help-cms .about-us-help-card-icon svg,
        .about-us-help-cms .about-us-help-link-svg svg {
          width: 100%;
          height: 100%;
        }
        .about-us-help-cms .about-us-help-card-icon svg {
          fill: currentColor;
        }
        .about-us-help-cms .about-us-help-card-icon svg path,
        .about-us-help-cms .about-us-help-card-icon svg g,
        .about-us-help-cms .about-us-help-card-icon svg polygon,
        .about-us-help-cms .about-us-help-card-icon svg circle,
        .about-us-help-cms .about-us-help-card-icon svg rect {
          fill: currentColor;
        }
      `}</style>
      <div className="relative flex flex-col lg:flex-row items-center mb-8 lg:mb-12 gap-4">
        <p
          className="uppercase text-left flex-1 lg:flex-none lg:absolute lg:left-0 lg:max-w-[40%] pr-4 text-black"
          style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}
        >
          {headerText}
        </p>
        <button
          className="bg-[#EE6E2A] text-white rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap mx-auto px-6 px-10"
          style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}
          type="button"
        >
          {ctaText}
        </button>
      </div>
      <div className="about-us-help-cms grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
        {cards.map((card, index) => (
          <div key={index} className="relative flex flex-col items-center text-center rounded-2xl p-6 lg:p-8 overflow-hidden w-full min-w-[273px] max-w-[330px] min-h-[298px] group/card">
            <svg viewBox="0 0 272.94 298.2" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path d="M13.61.11l244.59-.11c8.13.38,14.14,6.34,14.75,14.44v232.7c-.55,6.93-6.27,13.04-13.25,13.76-7.4.76-11.9.54-17.66,6.25-5.68,5.63-5.69,10.18-6.37,17.53-.65,6.94-6.38,12.61-13.23,13.47l-207.69.05c-8.23-.54-14.07-6.21-14.75-14.44V14.44C.57,6.84,5.98.92,13.61.11Z" style={{ fill: '#fff' }} />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center w-full h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="about-us-help-card-icon mb-4 flex-shrink-0 min-h-12 w-12 h-12 flex items-center justify-center" style={{ color: resolvedIconColor }}>
                  {card.iconSvg ? (
                    <InlineSvg markup={card.iconSvg} />
                  ) : card.iconUrl ? (
                    isSvgUrl(card.iconUrl) ? <InlineSvg url={card.iconUrl} /> : <img src={card.iconUrl} alt="" aria-hidden className="w-12 h-12 object-contain" />
                  ) : null}
                </div>
                <h3 className="font-bold uppercase text-sm lg:text-base mb-3" style={{ color: '#808080' }}>
                  {card.title}
                </h3>
                {renderDescription(card)}
              </div>
              <div className="pt-2">
                {card.linkMode === 'svg' ? (
                  <a
                    href={card.linkUrl || '#'}
                    className="about-us-help-link-svg w-10 h-10 flex flex-col items-center justify-center"
                    style={{ color: resolvedLinkSvgColor }}
                  >
                    {card.linkSvgMarkup ? (
                      <InlineSvg markup={card.linkSvgMarkup} forceCurrentColor={false} />
                    ) : card.linkSvgUrl ? (
                      isSvgUrl(card.linkSvgUrl) ? <InlineSvg url={card.linkSvgUrl} forceCurrentColor={false} /> : <img src={card.linkSvgUrl} alt="" aria-hidden className="w-10 h-10 object-contain" />
                    ) : null}
                    <span className="inline-block w-16 border-b-2 mt-1 transition-colors duration-200 border-[#22acb6] group-hover/card:border-[#ee6e2a]" />
                  </a>
                ) : (
                  <a href={card.linkUrl || '#'} className="text-sm font-bold border-b-2 transition-colors duration-200 border-[#22acb6] group-hover/card:border-[#ee6e2a]" style={{ color: '#808080' }}>
                    {card.linkText}
                  </a>
                )}
              </div>
            </div>
            <button type="button" className="absolute bottom-0 right-0 w-[31px] h-[31px] rounded-full flex items-center justify-center shadow bg-white z-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-all duration-300 stroke-[#22acb6] group-hover/card:stroke-[#ee6e2a] group-hover/card:rotate-[-45deg]">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
