import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function HomeAboutBlock({
  sectionId = 'about',
  anchor,
  barBgColor = '#22acb6',
  curvedRectColor = '#ffffff',
  scrollButtonBg = '#22ACB6',
  scrollButtonArrow = '#ffffff',
  buttonBgColor = '#EE6E2A',
  buttonTextColor = '#ffffff',
  badgeText = 'ABOUT US',
  bodyText = '',
  bodyTextColor = '#3b4e6b',
  readMoreLabel = 'READ MORE',
  readMoreUrl = '/about-us',
  readMoreTextColor = '#3b4e6b',
  readMoreHoverColor = '#22ACB6',
  readMoreCircleColor = '#22ACB6',
}) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(sectionId);
  const id = explicitAnchor || derived || 'about';

  const to = useMemo(() => {
    const raw = String(readMoreUrl || '').trim();
    return raw || '/about-us';
  }, [readMoreUrl]);

  const handleReadMore = (e) => {
    e.preventDefault();
    if (to.startsWith('/')) {
      navigate(to);
      return;
    }
    window.location.href = to;
  };

  return (
    <div id={id} className="relative bg-white pt-0 pb-10 overflow-visible flex flex-col" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: barBgColor, minHeight: '37px' }}>
        <svg
          viewBox="0 0 1088.78 38.01"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto absolute left-1/2"
          style={{ display: 'block', minWidth: '1089px', width: '1089px', transform: 'translateX(-50%)' }}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="clip-about-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-about-svg)">
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: curvedRectColor }} />
            <path
              d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
              style={{ fill: barBgColor }}
            />
          </g>
        </svg>
      </div>

      <div className="flex justify-center -mt-7 mb-0">
        <button
          onClick={scrollToNearestSection}
          className="hover:opacity-80 transition-opacity relative p-4 z-10 cursor-pointer"
          style={{ animation: 'float 3s ease-in-out infinite' }}
          aria-label="Scroll section to top"
        >
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button)">
              <path d={svgPaths.p1076300} fill={scrollButtonBg} />
              <path d={svgPaths.p27278800} fill={scrollButtonArrow} />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center mb-0">
        <button className="px-8 py-2 rounded-full text-sm mb-6" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
          {badgeText}
        </button>

        {bodyText ? (
          <p className="max-w-2xl mx-auto mb-6" style={{ color: bodyTextColor }}>
            {bodyText}
          </p>
        ) : null}

        <a
          href={to}
          onClick={handleReadMore}
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: hover ? readMoreHoverColor : readMoreTextColor }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <span>{readMoreLabel}</span>
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill={readMoreCircleColor} />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative w-4 h-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}

