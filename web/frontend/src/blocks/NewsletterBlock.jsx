import React, { useId, useMemo } from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { NewsletterSubscribeForm } from '../components/NewsletterSubscribeForm';
import { SectionTopCurveBar } from '../components/SectionTopCurveBar';

const BODY = 'Sans-serif, Helvetica, sans-serif';
const MUSEO_BLACK = "'Museo900-Regular', Museo, sans-serif";

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

export function NewsletterBlock({
  sectionId,
  anchor,
  gradientFrom,
  gradientVia,
  gradientTo,
  topBarBg,
  curveAccentColor,
  scrollButtonOuter,
  scrollButtonInner,
  kickerText,
  badgeText,
  titleText,
  headlineColor,
  kickerColor,
  imageUrl,
  imageAlt,
  emailPlaceholder,
  submitButtonText,
  submitButtonWidth,
  inputBgColor,
  inputTextColor,
  inputPlaceholderColor,
  submitBgColor,
  submitTextColor,
  submitArrowColor,
  badgeBgColor,
  badgeTextColor,
  newsletterListIds,
  newsletterFormId,
}) {
  const reactId = useId().replace(/:/g, '');
  const clipTop = `clip-newsletter-top-${reactId}`;
  const clipScroll = `clip0_scroll_newsletter-${reactId}`;
  const formUid = `nl-form-${reactId}`;

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || 'newsletter';

  const gf = str(gradientFrom) || '#00B2E0';
  const gv = str(gradientVia) || '#00AFBB';
  const gt = str(gradientTo) || '#00AB81';
  const barBg = str(topBarBg) || '#F5F4EE';
  const curve = str(curveAccentColor) || '#00AFBB';
  const scrollOut = str(scrollButtonOuter) || '#ffffff';
  const scrollIn = str(scrollButtonInner) || '#22ACB6';

  const kickerHtml = str(kickerText);
  const badgeHtml = str(badgeText);
  const titleHtml = str(titleText);
  const hl = str(headlineColor) || '#000000';
  const kc = str(kickerColor) || '#ffffff';

  const img = str(imageUrl);
  const imgAlt = str(imageAlt) || 'Newsletter';

  const listIds = useMemo(() => {
    const raw = str(newsletterListIds);
    if (!raw) return [];
    return raw
      .split(/[\s,;]+/)
      .map((part) => parseInt(part, 10))
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [newsletterListIds]);

  const ph = str(emailPlaceholder);
  const submitLabel = str(submitButtonText) || 'SUBSCRIBE';
  const btnW = str(submitButtonWidth) || '300px';

  const inputBg = str(inputBgColor) || '#38f0ba';
  const inputFg = str(inputTextColor) || '#3b4e6b';
  const phColor = str(inputPlaceholderColor) || '#3b4e6b';
  const submitBg = str(submitBgColor) || '#EE6E2A';
  const submitFg = str(submitTextColor) || '#ffffff';
  const arrowCol = str(submitArrowColor) || '#ffffff';
  const badgeBg = str(badgeBgColor) || '#EE6E2A';
  const badgeFg = str(badgeTextColor) || '#ffffff';

  return (
    <section
      id={sectionDomId}
      className="relative w-full overflow-x-hidden text-white pt-0 pb-0 overflow-visible"
      style={{ fontFamily: BODY }}
    >
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${gf}, ${gv}, ${gt})`,
        }}
      >
        {/* Curved top bar — full width to avoid clip edge lines on resize */}
        <SectionTopCurveBar clipId={clipTop} barBg={barBg} accentColor={curve} />

        {/* Scroll button — same SVG sizing as Mobile App block (w-14 h-14, p-4) */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center -mt-7 mb-0 relative z-10">
            <button
              type="button"
              onClick={scrollToNearestSection}
              className="hover:opacity-80 transition-opacity relative p-4 cursor-pointer"
              style={{ animation: 'float 3s ease-in-out infinite' }}
              aria-label="Scroll section to top"
            >
              <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
                <g clipPath={`url(#${clipScroll})`}>
                  <path d={svgPaths.p1076300} fill={scrollOut} />
                  <path d={svgPaths.p27278800} fill={scrollIn} />
                </g>
                <defs>
                  <clipPath id={clipScroll}>
                    <rect fill="white" height="57.648" width="57.7882" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
          {/* Top row: kicker + badge pill */}
          <div className="relative flex flex-col lg:flex-row items-center mb-8 lg:mb-12 gap-4">
            {kickerHtml ? (
              <div
                className="text-white uppercase text-left mt-2 lg:absolute lg:left-0 lg:max-w-[40%] pr-4 [&_p]:m-0"
                style={{ fontFamily: BODY, fontWeight: 500, fontSize: '14px', color: kc }}
                dangerouslySetInnerHTML={{ __html: kickerHtml }}
              />
            ) : null}
            {badgeHtml ? (
              <span
                className="px-6 rounded-full text-xs font-medium whitespace-nowrap mx-auto text-center hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                style={{
                  fontFamily: BODY,
                  minHeight: '36px',
                  backgroundColor: badgeBg,
                  color: badgeFg,
                }}
                dangerouslySetInnerHTML={{ __html: badgeHtml }}
              />
            ) : null}
          </div>

          {/* Middle row: headline + image */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end mb-8 lg:mb-12 gap-6">
            {titleHtml ? (
              <div
                className="text-[40px] font-bold text-center lg:text-left leading-tight [&_p]:m-0"
                style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, color: hl }}
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />
            ) : null}
            {img ? (
              <div className="flex-1 flex justify-center lg:justify-end w-full min-w-0">
                <ImageWithFallback
                  src={img}
                  alt={imgAlt}
                  className="h-auto w-full max-w-full object-contain"
                />
              </div>
            ) : null}
          </div>

          <NewsletterSubscribeForm
            formUid={formUid}
            emailPlaceholder={ph}
            submitButtonText={submitLabel}
            submitButtonWidth={btnW}
            inputBgColor={inputBg}
            inputTextColor={inputFg}
            inputPlaceholderColor={phColor}
            submitBgColor={submitBg}
            submitTextColor={submitFg}
            submitArrowColor={arrowCol}
            listIds={listIds}
            formId={str(newsletterFormId)}
          />
        </div>
      </div>
    </section>
  );
}
