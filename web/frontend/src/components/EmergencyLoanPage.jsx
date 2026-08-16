import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EmergencyLoanHeroSection } from './EmergencyLoanHeroSection';
import {
  EmergencyLoanAboutSection,
  EmergencyLoanFeaturesSection,
  EmergencyLoanWhateverSection,
  EmergencyLoanEligibilitySection,
} from './EmergencyLoanContentSection';
import { EmergencyLoanFAQSection } from './EmergencyLoanFAQSection';
import { EmergencyLoanApplySection } from './EmergencyLoanApplySection';
import emergencyBanner from '../../assets/image/loans/Emergency Loan.png';

export function EmergencyLoanPage() {
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
      <EmergencyLoanHeroSection bannerImage={emergencyBanner} />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
        <EmergencyLoanAboutSection index={0} />
        <EmergencyLoanWhateverSection />
        <EmergencyLoanFeaturesSection index={1} />
        <EmergencyLoanEligibilitySection index={2} />
        <EmergencyLoanFAQSection index={3} />
        <EmergencyLoanApplySection index={4} />
      </main>
    </div>
  );
}
