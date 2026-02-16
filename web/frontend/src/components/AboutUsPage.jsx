import { AboutUsHeroSection } from './AboutUsHeroSection';
import { AboutUsWhoWeAreSection } from './AboutUsWhoWeAreSection';
import { AboutUsStatsSection } from './AboutUsStatsSection';
import { AboutUsAwardsSection } from './AboutUsAwardsSection';
import { AboutUsHelpSection } from './AboutUsHelpSection';

export function AboutUsPage() {
  return (
    <div style={{ backgroundColor: '#f3f5f7' }}>
      <AboutUsHeroSection />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full px-0 pb-0 pt-[25px] mt-[20px] mb-16">
        <AboutUsWhoWeAreSection />
        <AboutUsStatsSection />
        <AboutUsAwardsSection />
        <AboutUsHelpSection />
      </main>
    </div>
  );
}
