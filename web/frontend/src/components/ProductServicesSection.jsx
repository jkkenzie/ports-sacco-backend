import { ArrowRight, ChevronDown } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';

export function ProductServicesSection() {
  return (
    <div id="services" className="relative bg-gradient-to-r from-[#00B2E0] via-[#00AFBB] to-[#00AB81] text-white pt-0 pb-28 overflow-visible">

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
            <clipPath id="clip-services-svg">
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-services-svg)">
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: '#00AFBB' }} />
            <path d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
             style={{ fill: '#F5F4EE' }} />
          </g>
        </svg>

      </div>

      {/* Scroll Down Button */}
      <div className="flex justify-center -mt-7 mb-0">
        <button className="hover:opacity-80 transition-opacity relative p-4 z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button)">
              <path d={svgPaths.p1076300} fill="white" />
              <path d={svgPaths.p27278800} fill="#22ACB6" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Section Header */}
        <div className="relative flex flex-col lg:flex-row items-center mb-2 gap-4 lg:gap-0 text-center lg:text-left pl-15">
          <p className="text-white uppercase lg:flex-none lg:absolute lg:left-0 lg:max-w-[40%] pr-4" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}>YOUR JOURNEY OF PROSPERITY START HERE!</p>
          <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap mx-auto" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
            HOW CAN WE UPLIFT YOU TODAY?
          </button>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl p-12 mt-12">
          <h2 className="text-[21px] text-[#3b4e6b] mb-2" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>
            PRODUCTS & SERVICES THAT UPLIFT YOUR FINANCIAL SUCCESS!
          </h2>
          <p className="text-[#3b4e6b] text-sm mb-8" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>SELECT THE PRODUCT OR SERVICE YOU NEED</p>

          {/* Dropdown */}
          <div className="mb-8 flex items-center gap-[1px]">
            <div className="relative flex-1">
              <select className="text-[#3b4e6b] text-[12px] font-bold bg-[#38f0ba] border border-[#e8e8e8] px-4 py-3 rounded-full appearance-none cursor-pointer w-full" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 700, paddingRight: '38px' }}>
                <option>How can we uplift you today?</option>
                <option>Savings & Investments</option>
                <option>Loan Products</option>
                <option>Financial Services</option>
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#3b4e6b] pointer-events-none" style={{ right: '16px' }} strokeWidth={3} />
            </div>
            <button type="button" className="bg-[#38f0ba] border border-[#e8e8e8] rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowRight className="w-4 h-4 text-[#3b4e6b]" strokeWidth={3} />
            </button>
          </div>

          {/* Horizontal Line */}
          <div style={{ height: '2px', backgroundColor: '#e8e8e8', marginTop: '12px', marginBottom: '12px' }}></div>

          {/* Product Buttons Grid */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                LOAN PRODUCTS
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                SAVINGS PRODUCTS
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                INVESTMENT OPTIONS
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                ASSET FINANCE
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                LPG FINANCING
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                CHEQUE CLEARANCE
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                SALARY PROCESSING
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                TILL NUMBER FOR BUSINESS
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                MOBILE & INTERNET BANKING
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                SCHOOL FEES COLLECTION ACCOUNT
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                STANDING ORDERS
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                INSURANCE
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                FINANCIAL ADVICE
                <ArrowRight className="size-4" />
              </button>
              <button className="bg-[#00ada0] border-2 border-[#e8e8e8] text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-[#ee6e2a] hover:text-white hover:border-[#ee6e2a] transition-colors" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                VISA ATM
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
