import React from 'react';
import { BlockRenderer } from '../blocks/BlockRenderer';

export function AboutUsHelpSection({ cmsHelpBlocks = [] }) {
  const hasCmsHelp = Array.isArray(cmsHelpBlocks) && cmsHelpBlocks.length > 0;
  if (!hasCmsHelp) {
    return null;
  }

  return (
    <section
      id="help"
      className="w-full py-12 px-12 lg:py-16"
      style={{
        backgroundColor: '#eef0f3',
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
      }}
    >
      <BlockRenderer blocks={cmsHelpBlocks} keyPrefix="help-cms" />
    </section>
  );
}
