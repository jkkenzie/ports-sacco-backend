import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MasaaLoanHeroSection } from './MasaaLoanHeroSection';
import {
  MasaaLoanAboutSection,
  MasaaLoanFeaturesSection,
  MasaaLoanWhateverSection,
  MasaaLoanEligibilitySection,
} from './MasaaLoanContentSection';
import { MasaaLoanFAQSection } from './MasaaLoanFAQSection';
import { MasaaLoanApplySection } from './MasaaLoanApplySection';
import masaaBanner from '../../assets/image/loans/Masaa Loan.png';

export function MasaaLoanPage() {
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
      <MasaaLoanHeroSection bannerImage={masaaBanner} />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
        <MasaaLoanAboutSection index={0} />
        <MasaaLoanWhateverSection />
        <MasaaLoanFeaturesSection index={1} />
        <MasaaLoanEligibilitySection index={2} />
        <MasaaLoanFAQSection index={3} />
        <MasaaLoanApplySection index={4} />
      </main>
    </div>
  );
}

