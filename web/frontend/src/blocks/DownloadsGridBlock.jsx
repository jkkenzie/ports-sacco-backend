import React from 'react';
import { DownloadsGridSection } from '../components/DownloadsGridSection';

export function DownloadsGridBlock({
  sectionTitle = 'Downloads',
  sectionIntro = 'Access our forms, reports, and policy documents below.',
  downloadLabel = 'Download PDF',
  sectionBgColor = '#f8fafc',
  cardBgColor = '#ffffff',
  accentColor = '#22acb6',
  buttonHoverColor = '#ee6e2a',
  headingColor = '#1e293b',
  titleColor = '#334155',
  rows = [],
}) {
  return (
    <DownloadsGridSection
      sectionTitle={sectionTitle}
      sectionIntro={sectionIntro}
      downloadLabel={downloadLabel}
      sectionBgColor={sectionBgColor}
      cardBgColor={cardBgColor}
      accentColor={accentColor}
      buttonHoverColor={buttonHoverColor}
      headingColor={headingColor}
      titleColor={titleColor}
      rows={rows}
    />
  );
}
