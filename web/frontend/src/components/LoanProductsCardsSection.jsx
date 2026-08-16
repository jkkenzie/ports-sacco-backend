import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import mobileBankingImg from '../../assets/image/products/Mobile Banking.png';
import chequeClearanceImg from '../../assets/image/products/Cheque Clearance.png';
import tillNumberImg from '../../assets/image/products/Till Number for Business.png';
import jiendelezeLoanImg from '../../assets/image/products/Jiendeleze Loan.png';
import schoolFeesLoanImg from '../../assets/image/products/School Fees Loan.png';
import fanikishaLoanImg from '../../assets/image/loans/Fanikisha Loan.png';
import emergencyLoanImg from '../../assets/image/loans/Emergency Loan.png';
import masaaLoanImg from '../../assets/image/loans/Masaa Loan.png';
import ukulimaLoanImg from '../../assets/image/loans/Ukulima Loan.png';
import megaLoanImg from '../../assets/image/loans/Mega Loan.png';
import normalLoanImg from '../../assets/image/loans/Normal Loan.png';
import additionalLoanImg from '../../assets/image/loans/Additional Loan.png';



// Mirror of SavingsProductsCardsSection, but with loan products.
const loanProductsData = [
  {
    image: jiendelezeLoanImg,
    title: 'Jiendeleze Loan',
    description:
      'Tailored for all your big projects with flexible repayment terms to empower your future with ease.',
    href: '/loan-products/jiendeleze-loan',
  },
  {
    image: schoolFeesLoanImg,
    title: 'School Fees Loan',
    description:
      'Secure your child’s education today! Our School Fees Loan provides quick funding to cover educational needs.',
  },
  {
    image: fanikishaLoanImg,
    title: 'Fanikisha Loan',
    description:
      'From guarantors, to vehicle logbooks and land title deeds, Fanikisha gives you multiple ways to secure your future!',
    href: '/loan-products/fanikisha-loan',
  },
  {
    image: emergencyLoanImg,
    title: 'Emergency Loan',
    description:
      'For those unpredictable moments in life, our Emergency Loan offers quick financial relief and peace of mind.',
    href: '/loan-products/emergency-loan',
  },
  {
    image: masaaLoanImg,
    title: 'Masaa Loan',
    description:
      'Get instant cash for those last-minute needs. The Masaa Loan is your go-to for fast, short-term financial needs.',
    href: '/loan-products/masaa-loan',
  },
  {
    image: ukulimaLoanImg,
    title: 'Ukulima Loan',
    description:
      'Support your agricultural ventures with ease. Get short-term funding to manage and grow your farm projects effectively.',
  },
  {
    image: megaLoanImg,
    title: 'Mega Loan',
    description:
      'Big dreams need big support! For your future home, land or farm with flexible payback options',
  },
  {
    image: normalLoanImg,
    title: 'Normal Loan',
    description:
      'Your go-to standard solution for every day financial needs.',
  },
  {
    image: additionalLoanImg,
    title: 'Additional Loan',
    description:
      'Extra funding when you need it most.',
  },
];

export function LoanProductsCardsSection() {
  return (
    <section className="w-full py-6 px-6 lg:py-6">
      <div className="mx-auto" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-3">
          {loanProductsData.map((item, index) => {
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

