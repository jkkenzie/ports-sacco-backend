import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import assetFinanceLoanImg from '../../assets/image/loans/Asset Finance Loan.png';
import lpoFinanceLoanImg from '../../assets/image/loans/LPO Financing.png';
import boreshaFinanceLoanImg from '../../assets/image/loans/Boresha Biashara Loan.png';
import instantLoanImg from '../../assets/image/loans/Instant Mobile Loan.png';
import salaryLoanImg from '../../assets/image/loans/Salary Advance.png';
import holidayLoanImg from '../../assets/image/loans/Holiday Advance Loan.png';
import groupLoanImg from '../../assets/image/loans/Group Chama Loan.png';



const loanFosaProductsData = [
  {
    image: assetFinanceLoanImg,
    title: 'Asset Finance Loan',
    description:
      'Our Asset Finance Loand is designed to help members acquire essential assets for both business and personal use. ',
    href: '/loan-products/asset-finance',
  },
  {
    image: lpoFinanceLoanImg,
    title: 'LPO Financing',
    description:
      'Ports Sacco LPO Financing is tailored to support your business in seamlessly fulfilling purchase orders.',
  },
  {
    image: boreshaFinanceLoanImg,
    title: 'Boresha Biashara Loan',
    description:
      'Strengthen your business with Ports Sacco Micro Loans, crafted to empower micro and small enterprises.',
  },
  {
    image: instantLoanImg,
    title: 'Instant (Mobile) Loan',
    description:
      'Get quick cash on the go with our mobile loan options. Enjoy swift financial solutions for urgent expenses.',
  },
  {
    image: salaryLoanImg,
    title: 'Salary Loan',
    description:
      'Get instant cash against your next pay cheque, cover your expenses and experience financial relief.',
  },
  {
    image: holidayLoanImg,
    title: 'Holiday Advance Loan',
    description:
      'Celebrate, relax, and create lasting memories with your loved ones while staying financially secure.',
  },
  {
    image: groupLoanImg,
    title: 'Group/Chama Loans',
    description:
      'Ideal for investment & welfare groups providing the financial boost needed to achieve collective goals.',
  },
];

export function LoanProductsFosaSection() {
  return (
    <section className="w-full py-6 px-6 lg:py-6">
      <div className="mx-auto" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-3">
          {loanFosaProductsData.map((item, index) => {
            const CardWrapper = item.href ? Link : 'a';
            const wrapperProps = item.href ? { to: item.href } : { href: '#' };

            return (
              <CardWrapper
                {...wrapperProps}
                key={index}
                className="group block relative w-full max-w-[350px] bg-white rounded-3xl p-2 cursor-pointer transition-opacity my-6 border-[#e8e8e8] border-[2px]"
                style={{ animation: 'slideInCard 0.6s ease-out' }}
              >
                {/* Image Section */}
                <div className="relative w-full">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10"
                    style={{ transform: 'scale(1.1)' }}
                  />
                  <span
                    className="absolute bg-[#82cdcb] text-white rounded-full group-hover:bg-[#ee6e2a] transition-colors z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0 pointer-events-none"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-6 pb-[0px]">
                  <h3
                    className="text-2xl text-[#22ACB6] mb-3 font-black"
                    style={{
                      fontFamily: 'Museo, Helvetica, sans-serif',
                      fontWeight: 900,
                      fontSize: '23px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <div className="w-full h-px bg-gray-300 mb-3" />
                  <p className="text-[#3b4e6b] text-sm mb-4">{item.description}</p>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

