import React from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

const CAROUSELS_WAVE_PATH =
  'M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z';

/** Top wave + scroll button from Xfrontend `#carousels` section. */
export function CarouselsTopIntro({
  waveFill = '#F5F4EE',
  scrollButtonBgColor = '#00AFBB',
  scrollButtonIconColor = '#ffffff',
  clipId = 'clip0_scroll_button_carousel',
}) {
  return (
    <>
      <div
        className="relative w-full shrink-0 overflow-hidden -top-8 pb-0 mt-0"
        style={{ minHeight: '37px' }}
      >
        <div className="flex items-end justify-center py-0 my-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 116.94 34.5"
            className="h-auto"
            style={{ width: '116.94px', height: 'auto' }}
            aria-hidden
          >
            <path d={CAROUSELS_WAVE_PATH} style={{ fill: waveFill }} />
          </svg>
        </div>
      </div>

      <div className="mb-0 flex justify-center -mt-16">
        <button
          type="button"
          onClick={scrollToNearestSection}
          className="relative z-10 cursor-pointer p-4 transition-opacity hover:opacity-80"
          style={{ animation: 'float 3s ease-in-out infinite' }}
          aria-label="Scroll section to top"
        >
          <svg className="block h-14 w-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath={`url(#${clipId})`}>
              <path d={svgPaths.p1076300} fill={scrollButtonBgColor} />
              <path d={svgPaths.p27278800} fill={scrollButtonIconColor} />
            </g>
            <defs>
              <clipPath id={clipId}>
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </>
  );
}
