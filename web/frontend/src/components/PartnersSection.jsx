import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
// Import partner logos
import cicGroupImg from '../../assets/image/cic-group.jpg';
import safaricomImg from '../../assets/image/safaricomjpg.jpg';
import sidianBankImg from '../../assets/image/SidianBank.jpg';
import kenyaPortsImg from '../../assets/image/Kenya-Ports-Authority.jpg';

export function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [scrollCount, setScrollCount] = useState(1);

  const partners = [
    { id: 1, name: 'SidianBank', image: sidianBankImg },
    { id: 2, name: 'CIC Group', image: cicGroupImg },
    { id: 3, name: 'Kenya Ports Authority', image: kenyaPortsImg },
    { id: 4, name: 'Safaricom', image: safaricomImg },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setVisibleCount(1);
        setScrollCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
        setScrollCount(1);
      } else {
        setVisibleCount(4);
        setScrollCount(4);
      }
      // Reset to first slide when resizing
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, partners.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + scrollCount, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - scrollCount, 0));
  };

  const goToSlide = (index) => {
    // Calculate which slide index corresponds to which starting index
    const slideIndex = index * scrollCount;
    setCurrentIndex(Math.min(slideIndex, maxIndex));
  };

  const totalSlides = scrollCount === 1 ? maxIndex + 1 : Math.ceil((maxIndex + 1) / scrollCount);

  return (
    <div id="partners" className="relative bg-white pt-0 pb-16 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
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
            <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" style={{ fill: '#ffffff' }} />
          </svg>
        </div>
      </div>
      {/* Scroll Down Button - Top Center */}
      <div className="flex justify-center -mt-16 mb-0 relative z-10">
        <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button_news)">
              <path d={svgPaths.p1076300} fill="#00AFBB" />
              <path d={svgPaths.p27278800} fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button_news">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Section Header */}
        <div className="relative flex flex-col lg:flex-row items-center mb-8 lg:mb-12 gap-4">
          <p className="text-[#22ACB6] uppercase text-left flex-1 lg:flex-none lg:absolute lg:left-0 lg:max-w-[40%] pr-4" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}>
            WE HAVE BUILT STRATEGIC PARTNERSHIPS FOR YOUR BENEFIT
          </p>
          <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap mx-auto" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
            OUR PARTNERS
          </button>
        </div>

        {/* Logo Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#00AFBB] hover:bg-[#00B2E0] rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#00AFBB] hover:bg-[#00B2E0] rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
              currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Logo Container */}
          <div className="overflow-hidden px-12 md:px-16">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${(currentIndex / visibleCount) * 100}%)`
              }}
            >
              {partners.map((partner, index) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-center h-32 px-2 flex-shrink-0"
                  style={{ 
                    width: `${(1 / visibleCount) * 100}%`
                  }}
                >
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => {
              const slideStartIndex = index * scrollCount;
              const isActive = currentIndex >= slideStartIndex && currentIndex < slideStartIndex + scrollCount;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isActive ? 'bg-[#EE6E2A]' : 'bg-white border border-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
