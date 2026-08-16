import React from 'react';
import { PrivacyPolicy } from '../components/PrivacyPolicy';

export function PrivacyPolicyBlock({
  sectionTitle,
  sectionIntro,
  sectionBgColor = '#ffffff',
  cardBgColor = '#f8fafc',
  accentColor = '#22acb6',
  headingColor = '#22acb6',
  titleColor = '#1e293b',
  bodyColor = '#334155',
  borderColor = '#e2e8f0',
  sections = [],
}) {
  return (
    <PrivacyPolicy
      sectionTitle={sectionTitle}
      sectionIntro={sectionIntro}
      sectionBgColor={sectionBgColor}
      cardBgColor={cardBgColor}
      accentColor={accentColor}
      headingColor={headingColor}
      titleColor={titleColor}
      bodyColor={bodyColor}
      borderColor={borderColor}
      sections={sections}
    />
  );
}
