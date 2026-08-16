import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { decodeHtmlEntities } from './CoreRichTextBlocks';
import { menuHref, menuRouterPath, shouldUseNativeAnchor } from '../utils/menuLink';

const DEFAULT_HEADING_COLOR = '#22ABB5';
const DEFAULT_TEXT_COLOR = '#000000';
const DEFAULT_ICON_BG = '#ED6E2A';
const DEFAULT_BG = '#ffffff';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function CheckmarkIcon({ iconBgColor, iconUrl, iconSvg }) {
  if (iconSvg) {
    return (
      <div
        className="flex items-center justify-center rounded-full overflow-hidden"
        style={{ width: '24px', height: '24px', backgroundColor: iconBgColor, flexShrink: 0 }}
      >
        <span className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: iconSvg }} />
      </div>
    );
  }
  if (iconUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-full overflow-hidden"
        style={{ width: '24px', height: '24px', backgroundColor: iconBgColor, flexShrink: 0 }}
      >
        <img src={iconUrl} alt="" aria-hidden className="w-4 h-4 object-contain" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: iconBgColor, flexShrink: 0 }}>
      <Check className="w-4 h-4 text-white" strokeWidth={3} />
    </div>
  );
}

function normalizeItems(items) {
  const saved = Array.isArray(items) ? items : [];
  return saved
    .map((item) => ({
      heading: String(item?.heading || item?.label || '').trim(),
      paragraph: String(item?.paragraph || item?.text || '').trim(),
      hasLink: Boolean(item?.hasLink),
      linkText: String(item?.linkText || '(click here)').trim(),
      linkUrl: String(item?.linkUrl || '').trim(),
    }))
    .filter((item) => item.heading || item.paragraph);
}

function InlineLinkWithIcon({ enabled, text, url, color, hoverColor, iconBg, iconHoverBg }) {
  const [hover, setHover] = useState(false);
  if (!enabled) return null;
  const href = String(url || '').trim();
  if (!href || href === '#') return null;
  const label = String(text || '').trim() || '(click here)';

  if (shouldUseNativeAnchor(href)) {
    return (
      <a
        href={menuHref(href)}
        className="font-black underline ml-1 inline-flex items-center gap-1"
        style={{ color: hover ? hoverColor : color }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {label}
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{ width: '20px', height: '20px', backgroundColor: hover ? iconHoverBg : iconBg }}
        >
          <ArrowRight size={12} strokeWidth={2} style={{ color: '#ffffff' }} />
        </span>
      </a>
    );
  }

  return (
    <Link
      to={menuRouterPath(href)}
      className="font-black underline ml-1 inline-flex items-center gap-1"
      style={{ color: hover ? hoverColor : color }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{ width: '20px', height: '20px', backgroundColor: hover ? iconHoverBg : iconBg }}
      >
        <ArrowRight size={12} strokeWidth={2} style={{ color: '#ffffff' }} />
      </span>
    </Link>
  );
}

function normalizeTable(headers, rows) {
  const h = Array.isArray(headers) && headers.length >= 4
    ? headers.slice(0, 4).map((x) => String(x ?? ''))
    : [
        'Membership Category',
        'Registration (KSH)',
        'Minimum Monthly Deposits Contribution (KSH)',
        'Share Capital',
      ];
  const r = Array.isArray(rows) && rows.length > 0
    ? rows.map((row) => {
        const cells = Array.isArray(row) ? row : [];
        return [0, 1, 2, 3].map((i) => String(cells[i] ?? ''));
      })
    : [['Individual', '500', '1,000', '40,000']];
  return { headers: h, rows: r };
}

function MembershipCta({ label, url, bg, text, hoverBg }) {
  const [hover, setHover] = useState(false);
  const raw = String(url || '').trim() || '/contact-us';

  const style = {
    backgroundColor: hover ? hoverBg : bg,
    color: text,
    fontFamily: ' Museo900-Regular, Museo, sans-serif',
  };

  if (!label || !String(label).trim()) return null;

  if (shouldUseNativeAnchor(raw)) {
    return (
      <div className="flex justify-center mt-8">
        <a
          href={menuHref(raw)}
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {label}
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8">
      <Link
        to={menuRouterPath(raw)}
        className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {label}
      </Link>
    </div>
  );
}

export function MembershipContentBlock({
  heading = 'Individual Membership',
  description = '',
  anchor,
  headingColor = DEFAULT_HEADING_COLOR,
  descriptionColor = DEFAULT_TEXT_COLOR,
  titleColor = DEFAULT_TEXT_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
  iconBgColor = DEFAULT_ICON_BG,
  backgroundColor = DEFAULT_BG,
  tableHeaderBg = '#e7f0f9',
  tableCellBg = '#f8f9fa',
  tableHeaders = [],
  tableRows = [],
  buttonLabel = 'JOIN US!',
  buttonUrl = '/contact-us',
  buttonBgColor = '#40C9BF',
  buttonTextColor = '#ffffff',
  buttonHoverBgColor = '#35b5ad',
  linkTextColor = '#22ABB5',
  linkHoverTextColor = '#ED6E2A',
  linkIconBgColor = '#22ABB5',
  linkIconHoverBgColor = '#ED6E2A',
  items = [],
  iconUrl = '',
  iconSvg = '',
  hiddenFromFront = false,
}) {
  if (hiddenFromFront) {
    return null;
  }

  const normalized = normalizeItems(items);
  const pairs = [];
  for (let i = 0; i < normalized.length; i += 2) {
    pairs.push({ left: normalized[i], right: normalized[i + 1] || null });
  }

  const { headers: th, rows: tr } = normalizeTable(tableHeaders, tableRows);
  const desc = String(description || '').trim();
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(heading);
  const id = explicitAnchor || derived || undefined;

  const hasContent =
    String(heading || '').trim() ||
    desc ||
    pairs.length > 0 ||
    (tr && tr.length > 0) ||
    String(buttonLabel || '').trim();

  if (!hasContent) return null;

  return (
    <section
      id={id}
      className="w-full py-11 px-6 lg:py-11"
      style={{
        fontFamily: ' Museo900-Regular, Museo, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || DEFAULT_BG,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {String(heading || '').trim() ? (
          <h2
            className="text-2xl md:text-3xl font-black mb-4"
            style={{ color: headingColor || DEFAULT_HEADING_COLOR, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
          >
            {decodeHtmlEntities(heading)}
          </h2>
        ) : null}

        {desc ? (
          <p className="text-base mb-8" style={{ color: descriptionColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}>
            {decodeHtmlEntities(desc)}
          </p>
        ) : null}

        {pairs.length > 0 ? (
          <div className="flex flex-col space-y-6 mb-12">
            {pairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', flexShrink: 0 }}>
                    <CheckmarkIcon iconBgColor={iconBgColor || DEFAULT_ICON_BG} iconUrl={iconUrl} iconSvg={iconSvg} />
                  </div>
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <div className="font-bold mb-2 text-[22px]" style={{ color: titleColor || DEFAULT_TEXT_COLOR, fontFamily: ' Museo900-Regular, Museo, sans-serif' }}>
                      {decodeHtmlEntities(pair.left?.heading || '')}
                    </div>
                    <div style={{ color: textColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}>
                      {decodeHtmlEntities(pair.left?.paragraph || '')}
                      <InlineLinkWithIcon
                        enabled={Boolean(pair.left?.hasLink)}
                        text={pair.left?.linkText}
                        url={pair.left?.linkUrl}
                        color={linkTextColor}
                        hoverColor={linkHoverTextColor}
                        iconBg={linkIconBgColor}
                        iconHoverBg={linkIconHoverBgColor}
                      />
                    </div>
                  </div>
                </div>

                {pair.right ? (
                  <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', flexShrink: 0 }}>
                      <CheckmarkIcon iconBgColor={iconBgColor || DEFAULT_ICON_BG} iconUrl={iconUrl} iconSvg={iconSvg} />
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <div className="font-bold mb-2 text-[22px]" style={{ color: titleColor || DEFAULT_TEXT_COLOR, fontFamily: ' Museo900-Regular, Museo, sans-serif' }}>
                        {decodeHtmlEntities(pair.right.heading)}
                      </div>
                      <div style={{ color: textColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}>
                        {decodeHtmlEntities(pair.right.paragraph)}
                        <InlineLinkWithIcon
                          enabled={Boolean(pair.right?.hasLink)}
                          text={pair.right?.linkText}
                          url={pair.right?.linkUrl}
                          color={linkTextColor}
                          hoverColor={linkHoverTextColor}
                          iconBg={linkIconBgColor}
                          iconHoverBg={linkIconHoverBgColor}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {tr.length > 0 ? (
          <div className="mb-12 overflow-x-auto">
            <table className="w-full border-separate" style={{ borderSpacing: '3px' }}>
              <thead>
                <tr style={{ backgroundColor: tableHeaderBg || '#e7f0f9' }}>
                  {th.map((cell, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left font-bold text-sm tracking-wide"
                      style={{ color: titleColor || DEFAULT_TEXT_COLOR, fontFamily: ' Museo900-Regular, Museo, sans-serif' }}
                    >
                      {decodeHtmlEntities(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tr.map((row, ri) => (
                  <tr key={ri} style={{ backgroundColor: '#ffffff' }}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-6 py-4 text-left"
                        style={{ backgroundColor: tableCellBg || '#f8f9fa', color: textColor || DEFAULT_TEXT_COLOR, fontFamily: 'Museo, Helvetica, sans-serif' }}
                      >
                        {decodeHtmlEntities(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <MembershipCta
          label={buttonLabel}
          url={buttonUrl}
          bg={buttonBgColor}
          text={buttonTextColor}
          hoverBg={buttonHoverBgColor}
        />
      </div>
    </section>
  );
}
