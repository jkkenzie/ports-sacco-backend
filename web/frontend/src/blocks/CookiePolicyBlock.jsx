import React from 'react';
import { PrivacyPolicy } from '../components/PrivacyPolicy';

const DEFAULT_TITLE = 'Cookie Policy';
const DEFAULT_INTRO =
  '<p>Ports DT Sacco ("us", "we", or "our") is a Sacco regulated by SASRA to offer financial services. We operate the www.portsacco.co.ke website, which provides more information of us and our various products and services (collectively, the "Services").</p><p>Our website uses cookies when you access our Services over the Internet. We explain which types of cookies we use, why and when we use them. Before we can use some - but not all - of these cookies, we need your consent.</p><p>We encourage you to familiarize yourself with our Data Privacy Policy which outlines your rights in relation to our collection and use of your personal information. To the extent permitted by the applicable law, by accessing or using our Services, you accept the data practices and terms detailed in this Cookie Policy. Please note that the acceptance of cookies is not a requirement for visiting the website.</p>';

export function CookiePolicyBlock({
  sectionTitle = DEFAULT_TITLE,
  sectionIntro = DEFAULT_INTRO,
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
