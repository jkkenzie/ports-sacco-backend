import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { useWpPage } from '../hooks/useWpPage';

const HERO_BLOCKS = ['custom/loan-archive-hero', 'custom/savings-archive-hero'];

export function ServicesPage() {
  const location = useLocation();
  const { blocks, status } = useWpPage('services');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = id ? document.getElementById(id) || document.querySelector(location.hash) : null;
      if (el) {
        setTimeout(() => {
          const headerOffset = 100;
          const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  if (status.loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-[#65605f]" style={{ fontFamily: 'Gotham Rounded, sans-serif' }}>
        Loading…
      </div>
    );
  }

  if (status.notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#1f0026] mb-2">Page not found</h1>
        <p className="text-[#65605f]">
          Create a published WordPress page with slug <code className="text-sm">services</code>.
        </p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 text-sm space-y-2">
        <p>{status.error}</p>
        <p className="text-[#65605f]">
          Test the API:{' '}
          <a className="text-[#22abb5] underline" href="/wp-json/portsacco/v1/page/services" target="_blank" rel="noreferrer">
            /wp-json/portsacco/v1/page/services
          </a>
        </p>
      </div>
    );
  }

  const heroIndex = blocks.findIndex((block) => HERO_BLOCKS.includes(block?.name));
  const hasHero = heroIndex >= 0;
  const heroBlock = hasHero ? [blocks[heroIndex]] : [];
  const otherBlocks = hasHero ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <>
      {hasHero ? <BlockRenderer blocks={heroBlock} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
          {otherBlocks.length > 0 ? (
            <BlockRenderer blocks={otherBlocks} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 text-sm">
              <p>No content blocks to display.</p>
              <p className="mt-2 text-xs">Loaded {blocks.length} block(s) from the API.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
