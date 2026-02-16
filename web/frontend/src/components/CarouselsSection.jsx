import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState } from 'react';
// Import product images
import schoolFeesLoanImg from '../../assets/image/products/School Fees Loan.png';
import assetFinanceLoanImg from '../../assets/image/products/Asset Finance Loan.png';
import jiendelezeLoanImg from '../../assets/image/products/Jiendeleze Loan.png';
import childrensSavingsImg from '../../assets/image/products/Childrens Savings Account.png';
import fixedDepositImg from '../../assets/image/products/Fixed Deposit Account.png';
import jointSavingsImg from '../../assets/image/products/Joint Savings Account.png';
import tillNumberImg from '../../assets/image/products/Till Number for Business.png';
import mobileBankingImg from '../../assets/image/products/Mobile Banking.png';
import chequeClearanceImg from '../../assets/image/products/Cheque Clearance.png';

// SVG paths for scroll button
const svgPaths = {
  p1076300: "M26.8184 0.0886972C50.4884 -1.7313 66.1284 24.8387 53.0284 44.7187C41.8284 61.7187 16.6884 62.0187 5.11841 45.2387C-7.56159 26.8387 4.68842 1.77869 26.8184 0.0786874V0.0886972ZM30.0584 36.9587V17.7587C30.0584 17.5487 29.1384 16.8687 28.7684 17.0187C28.4684 16.9987 27.7384 17.6087 27.7384 17.7587V36.9587C25.3084 35.2487 23.2584 32.0087 20.9384 30.3187C20.5784 30.0587 20.1484 29.6087 19.6384 29.8687L19.0384 30.7687L19.3284 31.6387L28.1484 40.4387L29.0184 40.7287L38.4484 31.6387C39.0884 31.0587 38.5584 29.7187 37.7584 29.7887C36.5384 29.8987 31.5984 36.0987 30.0484 36.9587H30.0584Z",
  p27278800: "M30.0584 36.9587C31.6084 36.0887 36.5484 29.8987 37.7684 29.7887C38.5684 29.7187 39.0884 31.0587 38.4584 31.6387L29.0284 40.7287L28.1584 40.4387L19.3384 31.6387L19.0484 30.7687L19.6484 29.8687C20.1584 29.6187 20.5884 30.0587 20.9484 30.3187C23.2584 32.0087 25.3184 35.2487 27.7484 36.9587V17.7587C27.7484 17.6187 28.4784 17.0087 28.7784 17.0187C29.1484 16.8687 30.0684 17.5387 30.0684 17.7587V36.9587H30.0584Z",
};

const carouselsData = [
  {
    sectionHeader: "ACHIEVE YOUR GOALS WITH OUR FLEXIBLE LENDING OPTIONS",
    buttonText: "LOANS",
    linkText: "ALL LOAN PRODUCTS",
    cards: [
      {
        image: schoolFeesLoanImg,
        title: "School Fees Loan",
        description: "Secure your child's education today! Our School Fees Loan provides quick funding to cover educational needs.",
        tag: "BECOME A MEMBER TODAY"
      },
      {
        image: assetFinanceLoanImg,
        title: "Asset Finance Loan",
        description: "Designed to help members acquire essential assets for both business and personal use.",
        tag: "BECOME A MEMBER TODAY"
      },
      {
        image: jiendelezeLoanImg,
        title: "Jiendoleze Loan",
        description: "Tailored for all your big projects with flexible repayment terms to empower your future with ease.",
        tag: "BECOME A MEMBER TODAY"
      }
    ]
  },
  {
    sectionHeader: "SAVE WITH US FOR HIGH YIELDS AND RETURNS",
    buttonText: "SAVINGS PRODUCTS",
    linkText: "ALL SAVINGS PRODUCTS",
    cards: [
      {
        image: childrensSavingsImg,
        title: "Children's Savings Account",
        description: "Open a Children's Savings Account with Ports Sacco today and start building a brighter tomorrow for your little ones.",
        tag: "SAVE & INVEST WITH US"
      },
      {
        image: fixedDepositImg,
        title: "Fixed Deposit Account",
        description: "Maximize your savings with guaranteed returns through our Fixed Deposit Account.",
        tag: "SAVE & INVEST WITH US"
      },
      {
        image: jointSavingsImg,
        title: "Joint Savings Account",
        description: "Double your savings power! Open a Joint Savings Account with us today to achieve your financial goals together.",
        tag: "SAVE & INVEST WITH US"
      }
    ]
  },
  {
    sectionHeader: "ENJOY A BROAD RANGE OF BANKING SERVICES FROM US",
    buttonText: "OUR SERVICES",
    linkText: "ALL OUR SERVICES",
    cards: [
      {
        image: tillNumberImg,
        title: "Till Number for Business",
        description: "Get your Ports Sacco Business Till Number today for Customers to pay quickly and securely via mobile money.",
        tag: "GET A LOAN FROM US"
      },
      {
        image: mobileBankingImg,
        title: "Mobile Banking",
        description: "Experience the ultimate convenience in banking with our Mobile Banking services.",
        tag: "GET A LOAN FROM US"
      },
      {
        image: chequeClearanceImg,
        title: "Cheque Clearance",
        description: "Clearing cheques made easy with our swift salary processing and cheque clearance services.",
        tag: "GET A LOAN FROM US"
      }
    ]
  }
];

export function CarouselsSection() {
  return (
    <div id="carousels" className="relative bg-[#F5F4EE] pt-0 pb-28 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>


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
          <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" style={{ fill: '#F5F4EE' }} />
        </svg>
      </div>
      </div>

      
      {/* Scroll Down Button */}
      <div className="flex justify-center -mt-16 mb-0">
        <button className="hover:opacity-80 transition-opacity relative p-4 z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button_carousel)">
              <path d={svgPaths.p1076300} fill="#00AFBB" />
              <path d={svgPaths.p27278800} fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button_carousel">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {carouselsData.map((carousel, carouselIndex) => (
          <Carousel
            key={carouselIndex}
            data={carousel}
            isLast={carouselIndex === carouselsData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function Carousel({ data, isLast }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className={`${!isLast ? 'mb-16' : ''}`}>
      {/* Section Header */}
      <div className="relative w-full mb-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-4 max-w-7xl mx-auto">
          <p className="text-[#22ACB6] text-[12px] font-medium">{data.sectionHeader}</p>
          <button className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0 bg-[#EE6E2A] text-white px-8 py-2 rounded-full text-[12px] font-medium hover:bg-[#d96525] transition-colors">
            {data.buttonText}
          </button>
          <a href="#" className="flex items-center gap-[1px] hover:opacity-80 transition-opacity lg:ml-auto">
            <span className="text-[#22ACB6] text-[12px] font-medium bg-white border border-[#e8e8e8] px-4 py-2 rounded-full">
              {data.linkText}
            </span>
            <div className="bg-white border border-[#e8e8e8] rounded-full w-9 h-9 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#22ACB6]" />
            </div>
          </a>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows - Hidden below 1024px */}
        <button
          onClick={prevSlide}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hover:bg-white hover:shadow-lg rounded-full items-center justify-center transition-all -translate-x-1/2"
        >
          <svg className="w-5 h-5" viewBox="0 0 10.31 16.11" fill="none">
            <path d="M6.51.66L.65,6.51C.24,6.93,0,7.5,0,8.08s.24,1.16.65,1.58l5.8,5.8c.87.87,2.28.87,3.15,0,.87-.87.87-2.28,0-3.16l-4.22-4.22,4.28-4.27c.87-.87.87-2.28,0-3.16C9.23.22,8.65,0,8.08,0s-1.14.22-1.58.66" fill="#82cdcb" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hover:bg-white hover:shadow-lg rounded-full items-center justify-center transition-all translate-x-1/2"
        >
          <svg className="w-5 h-5" viewBox="0 0 10.31 16.11" fill="none" style={{ transform: 'scaleX(-1)' }}>
            <path d="M6.51.66L.65,6.51C.24,6.93,0,7.5,0,8.08s.24,1.16.65,1.58l5.8,5.8c.87.87,2.28.87,3.15,0,.87-.87.87-2.28,0-3.16l-4.22-4.22,4.28-4.27c.87-.87.87-2.28,0-3.16C9.23.22,8.65,0,8.08,0s-1.14.22-1.58.66" fill="#82cdcb" />
          </svg>
        </button>

        {/* Cards Grid */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 justify-center lg:justify-items-center">
          {data.cards.map((card, index) => (
            <div
              key={index}
              className={`relative w-full max-w-[350px] transition-opacity duration-500 bg-white rounded-3xl p-2 ${index === currentSlide ? 'opacity-100' : 'opacity-0 hidden lg:block lg:opacity-100'
                }`}
              style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Image Section */}
              <div className="relative w-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10"
                  style={{ transform: 'scale(1.1)' }}
                />

                {/* Button positioned in corner of image */}
                <button
                  className="absolute bg-[#82cdcb] text-white rounded-full hover:bg-[#ee6e2a] transition-colors z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0"
                  style={{ width: '30px', height: '30px' }}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-6">
                <h3 className="text-2xl text-[#22ACB6] mb-3 font-bold" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700 }}>{card.title}</h3>
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <p className="text-[#3b4e6b] text-sm mb-4">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-[#EE6E2A]' : 'bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
