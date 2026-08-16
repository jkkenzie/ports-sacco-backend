import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { AboutUsHeroSection } from './AboutUsHeroSection';
import { AboutUsStatsSection } from './AboutUsStatsSection';
import { AboutUsAwardsSection } from './AboutUsAwardsSection';
import { AboutUsHelpSection } from './AboutUsHelpSection';

const CMS_SECTION_STYLE = {
  fontFamily: 'Sans-serif, Helvetica, sans-serif',
  animation: 'fadeInUp 0.8s ease-out',
  willChange: 'transform, opacity',
  scrollMarginTop: '100px',
};

/** About route: hero, optional WordPress blocks in main, then static sections. */
export function AboutUsPage({ blocks = [] }) {
  const location = useLocation();
  const allBlocks = Array.isArray(blocks) ? blocks : [];
  const cmsStatsBlocks = allBlocks.filter((b) => b?.name === 'custom/about-us-stats');
  const cmsAwardsBlocks = allBlocks.filter((b) => b?.name === 'custom/about-us-awards');
  const cmsHelpBlocks = allBlocks.filter((b) => b?.name === 'custom/about-us-help');
  const cmsMainBlocks = allBlocks.filter(
    (b) => b?.name !== 'custom/about-us-stats' && b?.name !== 'custom/about-us-awards' && b?.name !== 'custom/about-us-help'
  );
  const hasCmsIntro = cmsMainBlocks.length > 0;

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
      <AboutUsHeroSection />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
        {hasCmsIntro ? (
          <section
            id="who-we-are"
            className="w-full bg-white py-12 lg:py-16"
            style={CMS_SECTION_STYLE}
          >
            <div className="max-w-full mx-auto px-0">
              <BlockRenderer blocks={cmsMainBlocks} />
            </div>
          </section>
        ) : null}
        <AboutUsStatsSection cmsStatsBlocks={cmsStatsBlocks} />
        <AboutUsAwardsSection cmsAwardsBlocks={cmsAwardsBlocks} />
        <AboutUsHelpSection cmsHelpBlocks={cmsHelpBlocks} />
      </main>
    </div>
  );
}
