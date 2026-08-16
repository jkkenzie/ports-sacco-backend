import React from 'react';
import { BlockRenderer } from '../blocks/BlockRenderer';

export function AboutUsAwardsSection({ cmsAwardsBlocks = [] }) {
  const hasCmsAwards = Array.isArray(cmsAwardsBlocks) && cmsAwardsBlocks.length > 0;
  if (!hasCmsAwards) {
    return null;
  }

  return (
    <section
      id="awards"
      className="w-full bg-white py-12 lg:py-16"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', animation: 'fadeInUp 0.8s ease-out', willChange: 'transform, opacity', scrollMarginTop: '100px' }}
    >
      <BlockRenderer blocks={cmsAwardsBlocks} keyPrefix="awards-cms" />
    </section>
  );
}
