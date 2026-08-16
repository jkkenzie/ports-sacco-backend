import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CarouselsTopIntro } from './CarouselsTopIntro';
// Import product images
import schoolFeesLoanImg from '../../assets/image/products/School Fees Loan.png';
import assetFinanceLoanImg from '../../assets/image/products/Asset Finance Loan.png';
import childrensSavingsImg from '../../assets/image/products/Childrens Savings Account.png';
import fixedDepositImg from '../../assets/image/products/Fixed Deposit Account.png';
import jointSavingsImg from '../../assets/image/products/Joint Savings Account.png';
import tillNumberImg from '../../assets/image/products/Till Number for Business.png';
import mobileBankingImg from '../../assets/image/products/Mobile Banking.png';
import chequeClearanceImg from '../../assets/image/products/Cheque Clearance.png';

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
        tag: "BECOME A MEMBER TODAY",
        href: "/loan-products/asset-finance"
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
      <CarouselsTopIntro />

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
            <a
              href={card.href || '#'}
              key={index}
              className={`group block relative w-full max-w-[350px] transition-opacity duration-500 bg-white rounded-3xl cursor-pointer ${index === currentSlide ? 'opacity-100' : 'opacity-0 hidden lg:block lg:opacity-100'
                }`}
              style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))', padding: '1.2rem 0.5rem 0.5rem 0.5rem' }}
            >
              {/* Image Section */}
              <div className="relative w-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10"
                  style={{ transform: 'scale(1.1)' }}
                />

                {/* Button positioned in corner of image - hover styles when card or button hovered */}
                <span
                  className="absolute bg-[#82cdcb] text-white rounded-full group-hover:bg-[#ee6e2a] transition-colors z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0 pointer-events-none"
                  style={{ width: '30px', height: '30px' }}
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-6">
                <h3 className="text-2xl text-[#22ACB6] mb-3 font-bold" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 900 }}>{card.title}</h3>
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <p className="text-[#3b4e6b] text-sm mb-4">
                  {card.description}
                </p>
              </div>
            </a>
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
