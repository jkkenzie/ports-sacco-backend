import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { JiendelezeLoanHeroSection } from './JiendelezeLoanHeroSection';
import {
  JiendelezeLoanAboutSection,
  JiendelezeLoanFeaturesSection,
  JiendelezeLoanWhateverSection,
  JiendelezeLoanEligibilitySection,
} from './JiendelezeLoanContentSection';
import { JiendelezeLoanFAQSection } from './JiendelezeLoanFAQSection';
import { JiendelezeLoanApplySection } from './JiendelezeLoanApplySection';
import jiendelezeBanner from '../../assets/image/loans/Jiendeleze Loan.png';

export function JiendelezeLoanPage() {
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
      <JiendelezeLoanHeroSection bannerImage={jiendelezeBanner} />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
        <JiendelezeLoanAboutSection index={0} />
        <JiendelezeLoanWhateverSection />
        <JiendelezeLoanFeaturesSection index={1} />
        <JiendelezeLoanEligibilitySection index={2} />
        <JiendelezeLoanFAQSection index={3} />
        <JiendelezeLoanApplySection index={4} />
      </main>
    </div>
  );
}

