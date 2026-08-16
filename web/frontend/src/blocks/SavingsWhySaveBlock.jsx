import React from 'react';
import { Check } from 'lucide-react';
import { decodeHtmlEntities } from './CoreRichTextBlocks';

const DEFAULT_HEADING_COLOR = '#22ABB5';
const DEFAULT_TEXT_COLOR = '#000000';
const DEFAULT_ICON_BG_COLOR = '#ED6E2A';
const DEFAULT_BG_COLOR = '#ffffff';

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
      <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: '24px', height: '24px', backgroundColor: iconBgColor, flexShrink: 0 }}>
        <span className="w-4 h-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: iconSvg }} />
      </div>
    );
  }
  if (iconUrl) {
    return (
      <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: '24px', height: '24px', backgroundColor: iconBgColor, flexShrink: 0 }}>
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
      fullWidth: Boolean(item?.fullWidth),
      anchor: String(item?.anchor || '').trim(),
    }))
    .filter((item) => item.heading || item.paragraph);
}

export function SavingsWhySaveBlock({
  heading = 'Why Save With Us',
  description = '',
  items = [],
  footerText = '',
  anchor,
  headingColor = DEFAULT_HEADING_COLOR,
  titleColor = DEFAULT_TEXT_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
  iconBgColor = DEFAULT_ICON_BG_COLOR,
  backgroundColor = DEFAULT_BG_COLOR,
  iconUrl = '',
  iconSvg = '',
}) {
  const normalized = normalizeItems(items);

  if (normalized.length === 0) {
    return null;
  }

  const footer = String(footerText || '').trim();
  const sectionDescription = String(description || '').trim();
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(heading);
  const id = explicitAnchor || derived || undefined;

  return (
    <section
      id={id}
      className="w-full py-11 px-6 lg:py-11"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || DEFAULT_BG_COLOR,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-[27px] md:text-[27px] font-bold mb-4 pb-[10px]" style={{ color: headingColor || DEFAULT_HEADING_COLOR, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}>
          {heading}
        </h2>
        {sectionDescription ? (
          <p className="mb-10" style={{ color: textColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}>
            {sectionDescription}
          </p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {normalized.map((item, index) => (
            <div
              key={`${item.heading}-${index}`}
              className={item.fullWidth ? 'md:col-span-2' : ''}
              id={(item.anchor || slugifyId(item.heading) || undefined)}
              style={{ scrollMarginTop: '100px' }}
            >
              <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '24px', flexShrink: 0 }}>
                  <CheckmarkIcon iconBgColor={iconBgColor || DEFAULT_ICON_BG_COLOR} iconUrl={iconUrl} iconSvg={iconSvg} />
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="font-thin mb-2 text-[22px]" style={{ color: titleColor || DEFAULT_TEXT_COLOR, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}>
                    {item.heading}
                  </div>
                  <div
                    className="[&_.headless-why-save-big-text]:text-[20px]"
                    style={{ color: textColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item.paragraph) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {footer ? (
          <p style={{ color: textColor || DEFAULT_TEXT_COLOR, lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}>
            {footer}
          </p>
        ) : null}
      </div>
    </section>
  );
}
