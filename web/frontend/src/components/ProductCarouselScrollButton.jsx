import React from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

export function ProductCarouselScrollButton({
  clipId = 'clip0_scroll_button_loans_carousel',
  outerFill = '#00AFBB',
  innerFill = '#ffffff',
}) {
  return (
    <div className="mb-5 flex justify-center -mt-7">
      <button
        type="button"
        onClick={scrollToNearestSection}
        className="relative z-10 cursor-pointer p-4 transition-opacity hover:opacity-80"
        style={{ animation: 'float 3s ease-in-out infinite' }}
        aria-label="Scroll section to top"
      >
        <svg className="block h-14 w-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
          <g clipPath={`url(#${clipId})`}>
            <path d={svgPaths.p1076300} fill={outerFill} />
            <path d={svgPaths.p27278800} fill={innerFill} />
          </g>
          <defs>
            <clipPath id={clipId}>
              <rect fill="white" height="57.648" width="57.7882" />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
}
