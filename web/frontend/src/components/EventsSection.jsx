import svgPaths from '../imports/svg-ks2hcu51vg';
import portsSaccoWhiteLogo from '../../assets/image/ports-sacco-white-logo.png';
import backgroundPatternImg from '../../assets/image/background-pattern-01.png';

export function EventsSection() {
  return (
    <div
      id="events"
      className="relative w-full bg-gradient-to-r from-[#FF8C00] via-[#FF6347] to-[#800080] pt-0 pb-16 overflow-visible"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
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
            <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" style={{ fill: '#ff6346' }} />
          </svg>
        </div>
      </div>
      {/* Scroll Down Button - Top Center */}
      <div className="flex justify-center -mt-16 mb-0 relative z-10">
        <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
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


      {/* Background Pattern Overlay - Covers section, extends 40% outside top and right */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: '-60%',
          right: '-70%',
          width: '140%',
          height: '140%',
        }}
      >
        <img
          src={backgroundPatternImg}
          alt="Background Pattern"
          className="w-full h-full object-contain opacity-30"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Main Content - full-bleed so orchid SVG background reaches screen edges */}
      <div
        className="relative w-screen min-h-[200px] mt-6 py-3 overflow-hidden flex flex-col justify-center"
        style={{
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          animation: 'fadeInUp 0.8s ease-out',
        }}
      >
        {/* Orchid gradient background SVG - fills full viewport width */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
          viewBox="0 0 1078.61 190.03"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="events-orchid-gradient" x1="232" y1="-570.98" x2="1310.61" y2="-570.98" gradientTransform="translate(-232 666)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ff7bac" />
              <stop offset="0.22" stopColor="#ff7bac" stopOpacity="0.76" />
              <stop offset="0.6" stopColor="#ff7bac" stopOpacity="0.36" />
              <stop offset="0.87" stopColor="#ff7bac" stopOpacity="0.1" />
              <stop offset="1" stopColor="#ff7bac" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#events-orchid-gradient)" />
        </svg>
        {/* Content constrained with horizontal padding, vertically centered */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center" style={{ zIndex: 1 }}>
          {/* Event banner: black background, white text, left-aligned, 15px gaps */}
          <div className="w-full rounded-lg overflow-hidden flex flex-col sm:flex-row flex-wrap items-center text-white text-left" style={{ gap: '15px' }}>
            {/* Section 1: Logo + tagline — fit logo, do not grow */}
            <div className="flex flex-col justify-center items-start flex-none flex-shrink-0 mr-3">
              <img src={portsSaccoWhiteLogo} alt="Ports Sacco" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
            {/* Section 2: ADM / Annual Delegate Meeting */}
            <div className="flex flex-col justify-center flex-none flex-shrink-0">
              <span className="font-bold tracking-tight leading-none uppercase" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: 'clamp(44px, 12vw, 96px)' }}>ADM</span>
              <span className="uppercase tracking-wider mt-1" style={{ fontFamily: 'sans-serif, Helvetica, sans-serif', fontSize: '14px' }}>Annual Delegate Meeting</span>
            </div>
            {/* Wrapper so both vertical separators equal Friday column height */}
            <div className="flex flex-none flex-shrink-0 items-stretch">
              <div className="flex-shrink-0 w-px self-stretch border-l border-white border-dotted ml-6 mr-6" style={{ borderLeftWidth: '2px' }} />
              {/* Section 3: Date — FRIDAY+30 and JAN+2026 in one section with dotted line between */}
              <div className="flex flex-col justify-center flex-none flex-shrink-0">
                <div className="flex items-end gap-0">
                  <div className="flex flex-col items-start" style={{ width: 'fit-content' }}>
                    <span className="uppercase leading-none font-bold" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '37px', marginBottom: '2px' }}>FRIDAY</span>
                    <span className="font-bold leading-none block" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '117px' }}>30</span>
                  </div>
                  <div className="flex flex-col items-start" style={{ width: 'fit-content' }}>
                    <span className="uppercase leading-none font-bold block" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '83px' }}>JAN</span>
                    <span className="font-bold leading-none block" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '69px' }}>2026</span>
                  </div>
                </div>
              </div>
              {/* Separator before Venue column — same height as Friday column */}
              <div className="flex-shrink-0 w-px self-stretch border-l border-white border-dotted ml-5 mr-0" style={{ borderLeftWidth: '2px' }} />
            </div>
            {/* Section 4: Venue centered; 09.00 HOURS one line */}
            <div className="flex flex-col justify-center items-center flex-none flex-shrink-0 px-3">
              <span className="uppercase tracking-wider text-center w-full block" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '63px' }}>Venue</span>
              <div className="border-b border-white border-dotted w-full my-3" style={{ borderBottomWidth: '2px' }} />
              <span className="uppercase tracking-wider text-center w-full block whitespace-nowrap" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, fontSize: '32px' }}>09.00 HOURS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
