import React from 'react';
import { FaqSection } from '../components/FaqSection';

export function FaqSectionBlock({
  sectionTitle = 'Frequently Asked Questions',
  sectionIntro = 'Find answers to common questions about our products and services.',
  sectionBgColor = '#f8fafc',
  cardBgColor = '#ffffff',
  accentColor = '#22acb6',
  groupHeadingColor = '#1e293b',
  questionColor = '#1e293b',
  answerColor = '#475569',
  borderColor = '#e2e8f0',
  hoverBgColor = '#f8fafc',
  iconColor = '#22acb6',
  rows = [],
}) {
  return (
    <FaqSection
      sectionTitle={sectionTitle}
      sectionIntro={sectionIntro}
      sectionBgColor={sectionBgColor}
      cardBgColor={cardBgColor}
      accentColor={accentColor}
      groupHeadingColor={groupHeadingColor}
      questionColor={questionColor}
      answerColor={answerColor}
      borderColor={borderColor}
      hoverBgColor={hoverBgColor}
      iconColor={iconColor}
      rows={rows}
    />
  );
}
