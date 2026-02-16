import { ArrowRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import momentumImg from '../../assets/image/momentum.png';

export function NewsletterSection() {
  return (
    <div id="newsletter" className="relative bg-gradient-to-r from-[#00B2E0] via-[#00AFBB] to-[#00AB81] text-white pt-0 pb-0 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
      {/* Curved Top Border with Button */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#F5F4EE', minHeight: '37px' }}>

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
            <clipPath id="clip-newsletter-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-newsletter-svg)">
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: '#00AFBB' }} />
            <path d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
              style={{ fill: '#F5F4EE' }} />
          </g>
        </svg>

      </div>
      {/* Scroll Down Button - Top Center */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center -mt-7 mb-0 relative z-10">
          <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
              <g clipPath="url(#clip0_scroll_button_newsletter)">
                <path d={svgPaths.p1076300} fill="white" />
                <path d={svgPaths.p27278800} fill="#22ACB6" />
              </g>
              <defs>
                <clipPath id="clip0_scroll_button_newsletter">
                  <rect fill="white" height="57.648" width="57.7882" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Top Row - Intro Text and Newsletter Button */}
        <div className="relative flex flex-col lg:flex-row items-center mb-8 lg:mb-12 gap-4">
          <p className="text-white uppercase text-left mt-2 lg:absolute lg:left-0 lg:max-w-[40%] pr-4" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}>
            STAY UP TO DATE WITH ALL OUR INSIGHTS & EVENTS
          </p>
          <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap mx-auto" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
            THE MOMENTUM NEWSLETTER
          </button>
        </div>

        {/* Middle Row - Headline and Momentum Image */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end mb-8 lg:mb-12 gap-6">
          <h2 className="text-[40px] font-bold text-black text-center lg:text-left" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>
            Subscribe to our Newsletter
          </h2>
          <div className="flex-1 flex justify-center lg:justify-end">
            <img 
              src={momentumImg} 
              alt="Momentum" 
              className="h-auto w-full max-w-full"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Bottom Row - Email Input and Subscribe Button */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="flex-1 bg-[#38f0ba] text-[#3b4e6b] px-6 py-4 rounded-full text-base placeholder:text-[#3b4e6b] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
            style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
          />
          <button className="bg-[#EE6E2A] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#d96525] transition-colors flex items-center justify-between whitespace-nowrap relative" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', width: '300px' }}>
            <span className="flex-1 text-center">SUBSCRIBE</span>
            <ArrowRight className="w-5 h-5 absolute right-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
