import { ChevronRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';

const TEAL = '#22ACB6';

const starFilled = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
const starOutline = 'M12 5.72l1.76 3.56 3.93.57-2.85 2.78.67 3.92L12 14.5l-3.51 1.85.67-3.92-2.85-2.78 3.93-.57L12 5.72M12 2L8.55 8.63 2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L14 14.14l5-4.87-6.55-.64L12 2z';

function StarRatingDisplay({ value }) {
  const full = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex gap-0.5 items-center" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f-${i}`} width="18" height="18" viewBox="0 0 24 24" fill="#EAB308"><path d={starFilled} /></svg>
      ))}
      {hasHalf && (
        <span key="h" className="relative inline-block w-[18px] h-[18px] overflow-hidden">
          <svg className="absolute left-0 top-0 w-full h-full" width="18" height="18" viewBox="0 0 24 24" style={{ clipPath: 'inset(0 50% 0 0)' }}><path d={starFilled} fill="#EAB308" /></svg>
          <svg className="absolute left-0 top-0 w-full h-full" width="18" height="18" viewBox="0 0 24 24" style={{ clipPath: 'inset(0 0 0 50%)' }}><path d={starOutline} fill="#D1D5DB" /></svg>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e-${i}`} width="18" height="18" viewBox="0 0 24 24" fill="#D1D5DB"><path d={starOutline} /></svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    quote: 'I loved the customer service Ports Sacco provided to me. The team was polite and patient with the with all the questions I had. I am definitely coming back for another loan.',
    rating: 3,
    name: 'ANGELA MAKENA',
    title: 'BEAUTICIAN',
  },
  {
    quote: 'We came out of the Ports Sacco offices very happy with the service. They treated us with respect and the waiting period was appropriate.',
    rating: 4,
    name: 'MORRIS OUKO',
    title: 'CEO, THE GROUP',
  },
  {
    quote: 'I want to express my appreciation for the assistance that you provided to boost my Horticulture venture into a thriving business!',
    rating: 3.5,
    name: 'NDINDA MUTOKO',
    title: 'FARMER',
  },
];

export function MemberReviewsSection() {
  return (
    <div id="member-reviews" className="relative bg-white pt-0 pb-16 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
      {/* Curved Bottom Border with Button — same as PartnersSection */}
      <div className="relative w-full overflow-hidden flex-shrink-0 -top-8 pb-0 mt-0" style={{ minHeight: '37px' }}>
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
      {/* Scroll Down Button - Top Center — same as PartnersSection */}
      <div className="flex justify-center -mt-16 mb-0 relative z-10">
        <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button_reviews)">
              <path d={svgPaths.p1076300} fill="#ee6e2a" />
              <path d={svgPaths.p27278800} fill="transparent" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button_reviews">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Main Content — same structure as PartnersSection */}
      <div className="max-w-7xl mx-auto px-4 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Section Header: center = MEMBER REVIEWS + WHAT OUR MEMBERS SAY below; right = ALL REVIEWS + arrow */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between mb-8 lg:mb-12 gap-4">
          <div className="hidden lg:block flex-1 min-w-0" />
          <div className="flex flex-col items-center justify-center flex-1 min-w-0">
            <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
              MEMBER REVIEWS
            </button>
            <p className="text-[#22ACB6] uppercase mt-2 text-sm font-medium" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
              WHAT OUR MEMBERS SAY!
            </p>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <button type="button" className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium uppercase hover:bg-gray-50 transition-colors" style={{ color: TEAL }}>
              ALL REVIEWS
            </button>
            <button type="button" className="border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors" style={{ color: TEAL }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white rounded-lg p-6">
              <p className="text-gray-500 italic text-sm sm:text-base leading-relaxed mb-4 flex-grow">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="mb-3 flex justify-center">
                <StarRatingDisplay value={review.rating} />
              </div>
              <p className="font-bold uppercase text-sm" style={{ color: TEAL }}>
                {review.name} ({review.title})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
