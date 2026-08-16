import React from 'react';
import { Link } from 'react-router-dom';

function safeString(v) {
  return typeof v === 'string' ? v : '';
}

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AssetFinanceWhateverBlock({
  title = 'Get financing for whatever you need now',
  anchor,
  backgroundColor = '#22ACB6',
  titleColor = '#ffffff',
  buttonLabel = 'ENQUIRE NOW',
  buttonUrl = '#',
  buttonBgColor = '#ed6e2a',
  buttonTextColor = '#ffffff',
  buttonBorderColor = '#22ACB6',
  buttonHoverBgColor = '#ffffff',
  buttonHoverTextColor = '#ed6e2a',
  buttonHoverBorderColor = '#22ACB6',
}) {
  const [hover, setHover] = React.useState(false);
  const href = safeString(buttonUrl).trim() || '#';
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(title);
  const id = explicitAnchor || derived || 'what-ever';

  return (
    <section
      id={id}
      className="w-full py-[60px] px-6 lg:py-[60px]"
      style={{
        fontFamily: 'Museo, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || '#22ACB6',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2
            className="text-2xl md:text-3xl font-black mb-6"
            style={{ color: titleColor || '#ffffff', fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
          >
            {title}
          </h2>

          <div className="flex flex-wrap items-center justify-center">
            <Link
              to={href}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="inline-flex items-center justify-center px-11 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors"
              style={{
                backgroundColor: hover ? buttonHoverBgColor : buttonBgColor,
                color: hover ? buttonHoverTextColor : buttonTextColor,
                borderColor: hover ? buttonHoverBorderColor : buttonBorderColor,
              }}
            >
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

