import React from 'react';
import { BlockRenderer } from '../blocks/BlockRenderer';

export function AboutUsStatsSection({ cmsStatsBlocks = [] }) {
  const hasCmsStats = Array.isArray(cmsStatsBlocks) && cmsStatsBlocks.length > 0;
  if (!hasCmsStats) {
    return null;
  }

  return (
    <section
      id="stats"
      className="w-full py-12 px-12 lg:py-16"
      style={{
        backgroundColor: '#eef0f3',
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        animation: 'fadeInUp 0.8s ease-out',
        willChange: 'transform, opacity',
        scrollMarginTop: '100px',
      }}
    >
      <div className="max-w-full mx-auto px-0">
        <div className="mb-8 lg:mb-10">
          <BlockRenderer blocks={cmsStatsBlocks} keyPrefix="stats-cms" />
        </div>
      </div>
    </section>
  );
}
