import React from 'react';
import { BlockRenderer } from '../blocks/BlockRenderer';

/** Blocks rendered full-width above the main content column. */
export const PAGE_HERO_BLOCK_NAMES = ['custom/hero', 'custom/savings-archive-hero', 'custom/loan-archive-hero'];

export function splitPageHeroBlocks(blocks) {
  const list = Array.isArray(blocks) ? blocks : [];
  const heroIndex = list.findIndex((block) => PAGE_HERO_BLOCK_NAMES.includes(block?.name));
  const hasHero = heroIndex >= 0;

  return {
    hasHero,
    heroBlocks: hasHero ? [list[heroIndex]] : [],
    contentBlocks: hasHero ? list.filter((_, index) => index !== heroIndex) : list,
  };
}

/**
 * Standard CMS page shell: full-width hero, then blocks in a max-width column on #f3f5f7.
 * Matches Services, Membership, Events, Contact Us, and other archive-style pages.
 */
export function StandardPageLayout({
  blocks,
  contentSectionId = '',
  emptyMessage = 'No blocks on this page yet. Add blocks in WordPress (Gutenberg) to populate this route.',
}) {
  const { hasHero, heroBlocks, contentBlocks } = splitPageHeroBlocks(blocks);

  return (
    <>
      {hasHero ? <BlockRenderer blocks={heroBlocks} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
          {contentBlocks.length > 0 ? (
            contentSectionId ? (
              <section
                id={contentSectionId}
                className={`w-full${contentSectionId === 'about-us-content' ? ' bg-white' : ''}`}
              >
                <BlockRenderer blocks={contentBlocks} />
              </section>
            ) : (
              <BlockRenderer blocks={contentBlocks} />
            )
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 text-sm">{emptyMessage}</div>
          )}
        </main>
      </div>
    </>
  );
}
