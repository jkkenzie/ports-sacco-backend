import { ChevronDown } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';
// Import app store button images
import googlePlayImg from '../../assets/image/google-play.png';
import appStoreImg from '../../assets/image/app-store.png';
import ussdImg from '../../assets/image/ussd.png';

export function MobileAppSection() {
  return (
    <div id="mobile-app" className="relative bg-gradient-to-r from-[#00B2E0] via-[#00AFBB] to-[#00AB81] text-white pt-0 pb-0 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
      {/* Curved Bottom Border with Button */}
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
            <clipPath id="clip-mobile-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-mobile-svg)">
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
              <g clipPath="url(#clip0_scroll_button_mobile)">
                <path d={svgPaths.p1076300} fill="white" />
                <path d={svgPaths.p27278800} fill="#22ACB6" />
              </g>
              <defs>
                <clipPath id="clip0_scroll_button_mobile">
                  <rect fill="white" height="57.648" width="57.7882" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* Two Column Layout - 1/4 and 3/4 - Full Width */}
      <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px] lg:min-h-[600px] pt-8 lg:pt-12">
          {/* Left Section - Blue Gradient (1/4 width) */}
          <div className="relative text-white py-8 lg:py-3 lg:px-4 lg:col-span-4 lg:p-6 flex flex-col justify-start text-center lg:text-left">
            <div className='pb-8'>
              {/* Intro Text before M-PORT */}
              <p className="text-white uppercase text-center mt-2 mb-[15px] lg:mb-[35px]" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                ENJOY OUR MOBILE APP & USSD OPTIONS
              </p>
              <h2 className="text-[25px] font-bold mb-[15px] lg:mb-[55px] text-center" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>
                M-PORT
              </h2>
              <p className="text-[21px] text-white mb-[22px] text-center lg:text-left" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 300 }}>
                You can <b style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>Transact, Send</b> and <b style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>Receive money</b> conveniently from <b style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>anywhere</b>, at <b style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>anytime!</b>
              </p>
              <p className="text-[28px] font-bold mb-[8px] text-center lg:text-left" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>
                Download the app
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col min-[360px]:flex-row justify-center lg:justify-between gap-[10px] lg:gap-4 w-full">
              {/* Google Play Button */}
              <button className="hover:opacity-90 transition-opacity">
                <img src={googlePlayImg} alt="Get it on Google Play" className="h-auto" style={{ maxHeight: '60px' }} />
              </button>

              {/* App Store Button */}
              <button className="hover:opacity-90 transition-opacity lg:ml-auto">
                <img src={appStoreImg} alt="Download on the App Store" className="h-auto" style={{ maxHeight: '60px' }} />
              </button>
            </div>
          </div>

          {/* Right Section - Teal to Green Gradient (3/4 width) */}
          <div className="relative pt-8 lg:pt-0 px-8 pb-0 lg:pl-6 lg:pr-6 lg:pt-3 lg:col-span-8 flex flex-col">
            {/* Button in second column */}
            <div className="flex justify-center lg:justify-start mb-6">
              <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
                MOBILE BANKING SERVICES
              </button>
            </div>
            {/* USSD Image - Touching bottom, aligned left, filling width */}
            <img 
              src={ussdImg} 
              alt="USSD" 
              className="w-full max-w-[80%] mx-auto h-auto mt-auto lg:absolute lg:bottom-0 lg:inset-x-6 lg:h-full lg:w-auto lg:max-w-none lg:mx-0 lg:mt-0"
              style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
            />


          </div>
        </div>
      </div>
    </div>
  );
}

