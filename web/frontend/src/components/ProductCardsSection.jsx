import { ArrowRight, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import curvePathSvg from '../imports/svg-86bk8hyon9';
import svgPaths from '../imports/svg-ks2hcu51vg';

// Import service images
import joinUsImg from '../../assets/image/services/Join us.png';
import flexibleLoanImg from '../../assets/image/services/Flexible Loan Options.png';
import secureYourFutureImg from '../../assets/image/services/Secure Your Future.png';

export function ProductCardsSection() {
  return (
    <div id="products" className="relative bg-[#F5F4EE] pt-0 pb-10 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>

      {/* Curved Bottom Border with Button */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#ffffff', minHeight: '37px' }}>

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
            <clipPath id="clip-products-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-products-svg)">
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: '#F5F4EE' }} />
            <path d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z" style={{ fill: '#FFFFFF' }} />
          </g>
        </svg>

      </div>

      {/* Scroll Down Button */}
      <div className="flex justify-center -mt-7 mb-0">
        <button className="hover:opacity-80 transition-opacity relative p-4 z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button)">
              <path d={svgPaths.p1076300} fill="white" />
              <path d={svgPaths.p27278800} fill="transparent" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Shared SVG definitions for all card clip-paths */}
      <svg className="absolute" width="0" height="0" viewBox="0 0 293 185">
        <defs>
          <clipPath id="card-clip" clipPathUnits="objectBoundingBox" transform="scale(0.00341297, 0.00540541)">
            {/* Rectangle with rounded bottom-left corner and S-shaped cutout in bottom-right corner - adjusted 8px higher and 4px more to right */}
            <path d="M 0,0 L 293,0 L 293,111 C 294,118 288,133 275,133 C 268,134 264,133 258,139 C 252,145 252,149 251,157 C 251,164 245,169 242,170 L 15,170 Q 0,170 0,155 L 0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Section Header */}
        <div className="text-center mb-4">
          <p className="text-[#22ACB6] text-sm mb-4">EXPLORE OUR WIDE RANGE OF PRODUCTS AND SERVICES.</p>
          <button className="bg-[#EE6E2A] text-white px-8 py-2 rounded-full text-sm">
            EXPLORE
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 justify-items-center">
          {/* Card 1: Join Us */}
          <div className="relative w-full max-w-[350px]" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))', animation: 'slideInCard 0.6s ease-out' }}>
            {/* Image Section */}
            <div className="relative overflow-visible rounded-t-3xl">
              <div className="relative bg-gradient-to-br from-[#00B2E0] to-[#00AB81] rounded-t-3xl">
                <ImageWithFallback
                  src={joinUsImg}
                  alt="Join Us"
                  className="relative h-auto w-auto overflow-visible mx-auto z-[5]"
                  style={{ transform: 'scale(1.3)' }}
                />
              </div>
              {/* Content Section with S-curve */}
              <div className="content relative overflow-visible z-0 -top-6">
                <div className="relative p-6 bg-white w-full " style={{ clipPath: 'url(#card-clip)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <div className="flex items-start gap-2 mb-2 pt-5">
                    <div className="w-1 h-4 bg-[#F06E2A] rounded-full"></div>
                    <p className="text-[#3b4e6b] text-xs">BECOME A MEMBER TODAY</p>
                  </div>
                  <h3 className="text-2xl text-[#22ACB6] mb-3" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>Join Us</h3>
                  <p className="text-[#3b4e6b] text-sm mb-4">
                    Join Ports Sacco today and get all your financial needs under one roof!
                  </p>
                </div>


                {/* Button positioned in S-curve corner */}
                <button
                  className="absolute bg-[#EE6E2A] text-white rounded-full hover:bg-[#d96525] transition-colors z-10 flex items-center justify-center"
                  style={{ bottom: '12px', right: '4px', width: '35px', height: '35px' }}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Card 2: SecureYour Future */}
          <div className="relative w-full max-w-[350px]" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))', animation: 'slideInCard 0.6s ease-out' }}>
            {/* Image Section */}
            <div className="relative overflow-visible rounded-t-3xl">
              <div className="relative bg-gradient-to-br from-[#00B2E0] to-[#00AB81] overflow-visible rounded-t-3xl">
                <ImageWithFallback
                  src={secureYourFutureImg}
                  alt="Secure Your Future"
                  className="h-full w-auto overflow-visible mx-auto"
                  style={{ transform: 'scale(1.3)' }}
                />
              </div>
              {/* Content Section with S-curve */}
              <div className="content relative -mt-7 overflow-visible">
                <div className="relative p-6 bg-white w-full" style={{ clipPath: 'url(#card-clip)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <div className="flex items-start gap-2 mb-2 pt-5">
                    <div className="w-1 h-4 bg-[#F06E2A] rounded-full"></div>
                    <p className="text-[#3b4e6b] text-xs">SAVE & INVEST WITH US</p>
                  </div>
                  <h3 className="text-2xl text-[#22ACB6] mb-3" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>SecureYour Future</h3>
                  <p className="text-[#3b4e6b] text-sm mb-4">
                    Maximize your savings with attractive interest rates and peace of mind.
                  </p>
                </div>

                {/* Button positioned in S-curve corner */}
                <button
                  className="absolute bg-white text-[#3b4e6b] rounded-full hover:bg-gray-50 transition-colors z-10 flex items-center justify-center"
                  style={{ bottom: '12px', right: '4px', width: '35px', height: '35px' }}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>


          </div>

          {/* Card 3: Flexible Loan Options */}
          <div className="relative w-full max-w-[350px]" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))', animation: 'slideInCard 0.6s ease-out' }}>
            {/* Image Section */}
            <div className="relative overflow-visible rounded-t-3xl">
              <div className="relative bg-gradient-to-br from-[#00B2E0] to-[#00AB81] overflow-visible rounded-t-3xl">
                <ImageWithFallback
                  src={flexibleLoanImg}
                  alt="Flexible Loan Options"
                  className="h-full w-auto overflow-visible mx-auto"
                  style={{ transform: 'scale(1.3)' }}
                />
              </div>
              {/* Content Section with S-curve */}
              <div className="content relative -mt-7 overflow-visible">

                <div className="relative p-6 bg-white w-full" style={{ clipPath: 'url(#card-clip)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <div className="flex items-start gap-2 mb-2 pt-5">
                    <div className="w-1 h-4 bg-[#F06E2A] rounded-full"></div>
                    <p className="text-[#3b4e6b] text-xs">GET A LOAN FROM US</p>
                  </div>
                  <h3 className="text-2xl text-[#22ACB6] mb-3" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>Flexible Loan Options</h3>
                  <p className="text-[#3b4e6b] text-sm mb-4">
                    Get flexible loan options tailored to your needs and goals.
                  </p>
                </div>

                {/* Button positioned in S-curve corner */}
                <button
                  className="absolute bg-white text-[#3b4e6b] rounded-full hover:bg-gray-50 transition-colors z-10 flex items-center justify-center"
                  style={{ bottom: '12px', right: '4px', width: '35px', height: '35px' }}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

    </div>
  );
}
