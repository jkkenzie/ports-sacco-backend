import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FanikishaLoanHeroSection } from './FanikishaLoanHeroSection';
import {
  FanikishaLoanAboutSection,
  FanikishaLoanFeaturesSection,
  FanikishaLoanWhateverSection,
  FanikishaLoanEligibilitySection,
} from './FanikishaLoanContentSection';
import { FanikishaLoanFAQSection } from './FanikishaLoanFAQSection';
import { FanikishaLoanApplySection } from './FanikishaLoanApplySection';
import fanikishaBanner from '../../assets/image/loans/Loans Page Banner.png';

export function FanikishaLoanPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div style={{ backgroundColor: '#f3f5f7' }}>
      <FanikishaLoanHeroSection bannerImage={fanikishaBanner} />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
        <FanikishaLoanAboutSection index={0} />
        <FanikishaLoanWhateverSection />
        <FanikishaLoanFeaturesSection index={1} />
        <FanikishaLoanEligibilitySection index={2} />
        <FanikishaLoanFAQSection index={3} />
        <FanikishaLoanApplySection index={4} />
      </main>
    </div>
  );
}

