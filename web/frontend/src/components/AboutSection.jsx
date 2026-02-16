import { ArrowRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';

export function AboutSection() {
  return (
    <div id="about" className="relative bg-white pt-0 pb-10 overflow-visible flex flex-col" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif'}}>
      {/* Curved Bottom Border with Button */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#22acb6', minHeight: '37px' }}>

        <svg
          viewBox="0 0 1088.78 38.01"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto absolute left-1/2"
          style={{
            display: 'block',
            minWidth: '1089px',
            width: '1089px',
            transform: 'translateX(-50%)'
          }}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="clip-about-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-about-svg)">
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: '#fff' }} />
            <path d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z" style={{ fill: '#22acb6' }} />
          </g>
        </svg>

      </div>
      {/* Scroll Down Button - Moved to Top */}
      <div className="flex justify-center -mt-7 mb-0">
        <button className="hover:opacity-80 transition-opacity relative p-4 z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button)">
              <path d={svgPaths.p1076300} fill="#22ACB6" />
              <path d={svgPaths.p27278800} fill="white" />
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
        {/* About Us Button */}
        <button className="bg-[#EE6E2A] text-white px-8 py-2 rounded-full text-sm mb-6">
          ABOUT US
        </button>

        {/* About Text */}
        <p className="text-[#3b4e6b] max-w-2xl mx-auto mb-6">
          Ports DT Sacco, your trusted financial partner since 1966, is a Tier 1 licensed deposit-taking Sacco
          regulated by the Sacco Society Regulatory Authority (SASRA)...
        </p>

        {/* Read More Button */}
        <button className="inline-flex items-center gap-2 text-[#3b4e6b] text-sm">
          <span>READ MORE</span>
          <div className="relative w-5 h-5">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
              <g clipPath="url(#clip0_26_193)">
                <path d={svgPaths.p1076300} fill="#22ACB6" />
                <path d={svgPaths.p27278800} fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_26_193">
                  <rect fill="white" height="57.648" width="57.7882" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </button>
      </div>


    </div>
  );
}
