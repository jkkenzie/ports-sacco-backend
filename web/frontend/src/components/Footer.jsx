import React from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import portsSaccoLogo from '../../assets/image/ports-sacco-logo.png';
import { scrollToNearestSection } from '../utils/scrollToSection';
import googlePlayWhiteSvg from '../../assets/image/google-play-white.svg';
import iosIconWhiteSvg from '../../assets/image/ios-icon-white.svg';
import callIcon from '../../assets/image/call-01.svg';
import atIcon from '../../assets/image/at.svg';
import addressIcon from '../../assets/image/address.svg';
import boxAddressIcon from '../../assets/image/box-address.svg';
import { FooterWpSection } from './FooterWpSection';

const TEAL = '#22ACB6';
const FOOTER_BG = '#1f0026'; // Dark purple/indigo from SVG

export function Footer() {
  return (
    <footer id="footer" className="relative pt-0 pb-15 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: FOOTER_BG }}>
      {/* Curved Bottom Border with Button */}
      <div className="relative w-full overflow-hidden flex-shrink-0 -top-8 pb-0 mt-0" style={{ minHeight: '37px' }}>

        {/* Bottom Center SVG */}
        <div className="flex justify-center items-end py-0 my-0">
          <svg
            id="uuid-cf6eeeb7-b9e9-41c3-9bc3-ae3292c2c0e0"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 116.94 34.5"
            className="h-auto"
            style={{ width: '116.94px', height: 'auto' }}
          >
            <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" 
            style={{ fill: '#000000' }} />
          </svg>
        </div>
      </div>
      {/* Scroll Down Button - Top Center */}
      <div className="flex justify-center -mt-16 mb-0 relative z-10">
        <button 
          onClick={scrollToNearestSection}
          className="hover:opacity-80 transition-opacity relative p-4 cursor-pointer" 
          style={{ animation: 'float 3s ease-in-out infinite' }}
          aria-label="Scroll section to top"
        >
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button_news)">
              <path d={svgPaths.p1076300} fill="#FFFFFF" />
              <path d={svgPaths.p27278800} fill="transparent" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button_news">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <FooterWpSection
        portsSaccoLogo={portsSaccoLogo}
        googlePlayWhiteSvg={googlePlayWhiteSvg}
        iosIconWhiteSvg={iosIconWhiteSvg}
        callIcon={callIcon}
        atIcon={atIcon}
        addressIcon={addressIcon}
        boxAddressIcon={boxAddressIcon}
      />
    </footer>
  );
}
