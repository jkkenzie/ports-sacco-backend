import React, { useId } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SectionTopCurveBar } from '../components/SectionTopCurveBar';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

const BODY_SANS = 'Sans-serif, Helvetica, sans-serif';
const MUSEO_BLACK = "'Museo900-Regular', Museo, sans-serif";
const MUSEO_THIN = "'Museo100-Regular', Museo, sans-serif";

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

function coercePlayLinks(rawLinks, fallbackUrl) {
  let source = rawLinks;

  if (typeof source === 'string' && source.trim()) {
    try {
      source = JSON.parse(source);
    } catch {
      source = null;
    }
  }

  const rows = Array.isArray(source)
    ? source
    : source && typeof source === 'object'
      ? Object.values(source)
      : [];

  const links = rows
    .map((row) => ({
      label: str(row?.label) || 'Google Play',
      url: str(row?.url),
    }))
    .filter((row) => row.url);

  if (links.length) {
    return links;
  }

  const single = str(fallbackUrl);
  return single ? [{ label: 'Google Play', url: single }] : [];
}

function GooglePlayDownloads({ imageUrl, links }) {
  if (!links.length) return null;

  if (links.length === 1) {
    return (
      <a
        href={links[0].url}
        className="inline-flex justify-center transition-opacity hover:opacity-90"
        target="_blank"
        rel="noopener noreferrer"
      >
        {imageUrl ? (
          <ImageWithFallback src={imageUrl} alt="Get it on Google Play" className="h-auto" style={{ maxHeight: '60px' }} />
        ) : (
          <span
            className="inline-flex rounded-full border-2 border-white px-5 py-2 text-sm font-semibold text-white"
            style={{ fontFamily: BODY_SANS }}
          >
            {links[0].label}
          </span>
        )}
      </a>
    );
  }

  return (
    <div className="flex w-full max-w-[300px] flex-col items-center gap-3 lg:items-start">
      {imageUrl ? (
        <ImageWithFallback
          src={imageUrl}
          alt="Get it on Google Play"
          className="h-auto"
          style={{ maxHeight: '52px' }}
        />
      ) : null}
      <div className="flex w-full flex-col gap-2">
        {links.map((link) => (
          <a
            key={`${link.label}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/90 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#22ACB6]"
            style={{ fontFamily: BODY_SANS }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function MobileAppBlock(props) {
  const {
  sectionId,
  anchor,
  gradientFrom,
  gradientVia,
  gradientTo,
  topBarBg,
  curveAccentColor,
  kickerText,
  titleText,
  bodyHtml,
  downloadHeading,
  badgeText,
  googlePlayImageUrl,
  appStoreImageUrl,
  ussdImageUrl,
  googlePlayLinkUrl,
  googlePlayLinks,
  appStoreLinkUrl,
  scrollButtonOuterFill,
  scrollButtonInnerFill,
  badgeBgColor,
  badgeTextColor,
  } = props;
  const reactId = useId().replace(/:/g, '');
  const clipMobile = `clip-mobile-svg-${reactId}`;
  const scrollClipId = `clip0_scroll_button_mobile_${reactId}`;

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || 'mobile-app';

  const gpUrl = str(googlePlayImageUrl);
  const asUrl = str(appStoreImageUrl);
  const ussdUrl = str(ussdImageUrl);

  const playLinks = coercePlayLinks(googlePlayLinks, googlePlayLinkUrl);
  const asLink = str(appStoreLinkUrl);

  const kicker = str(kickerText);
  const title = str(titleText);
  const body = str(bodyHtml);
  const download = str(downloadHeading);
  const badge = str(badgeText);

  const gf = str(gradientFrom) || '#00B2E0';
  const gv = str(gradientVia) || '#00AFBB';
  const gt = str(gradientTo) || '#00AB81';
  const barBg = str(topBarBg) || '#F5F4EE';
  const curve = str(curveAccentColor) || '#00AFBB';
  const scrollOuter = str(scrollButtonOuterFill) || '#ffffff';
  const scrollInner = str(scrollButtonInnerFill) || '#22ACB6';
  const badgeBg = str(badgeBgColor) || '#EE6E2A';
  const badgeFg = str(badgeTextColor) || '#ffffff';

  const showStoreRow = Boolean((gpUrl && playLinks.length) || asUrl);
  const showBadge = Boolean(badge);
  const showBody = Boolean(body);

  const kickerHtml = kicker || '';
  const titleHtml = title || '';
  const downloadHtml = download || '';
  const badgeHtml = badge || '';

  return (
    <div
      id={sectionDomId}
      className="relative overflow-visible pt-0 pb-0 text-white"
      style={{
        fontFamily: BODY_SANS,
        background: `linear-gradient(to right, ${gf}, ${gv}, ${gt})`,
      }}
    >
      <SectionTopCurveBar clipId={clipMobile} barBg={barBg} accentColor={curve} pathFill={barBg} />

      <div className="mx-auto max-w-7xl px-4">
        <div className="relative z-10 mb-0 flex justify-center -mt-7">
          <button
            type="button"
            onClick={scrollToNearestSection}
            className="relative cursor-pointer p-4 transition-opacity hover:opacity-80"
            style={{ animation: 'float 3s ease-in-out infinite' }}
            aria-label="Scroll section to top"
          >
            <svg className="block h-14 w-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
              <g clipPath={`url(#${scrollClipId})`}>
                <path d={svgPaths.p1076300} fill={scrollOuter} />
                <path d={svgPaths.p27278800} fill={scrollInner} />
              </g>
              <defs>
                <clipPath id={scrollClipId}>
                  <rect fill="white" height="57.648" width="57.7882" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid min-h-[400px] grid-cols-1 lg:min-h-[600px] lg:grid-cols-12 lg:pt-12 pt-8">
          <div className="relative flex flex-col justify-start py-8 text-center text-white lg:col-span-4 lg:p-6 lg:px-4 lg:py-3 lg:text-left">
            <div className="pb-8">
              {kicker ? (
                <div
                  className="mb-[15px] mt-2 text-center uppercase text-white lg:mb-[35px] [&_p]:m-0 [&_p]:uppercase"
                  style={{ fontFamily: BODY_SANS, fontWeight: 500, fontSize: '14px' }}
                  dangerouslySetInnerHTML={{ __html: kickerHtml }}
                />
              ) : null}
              {title ? (
                <div
                  className="mb-[15px] text-center text-[25px] font-bold lg:mb-[55px] [&_h1]:m-0 [&_h2]:m-0 [&_h1]:text-[25px] [&_h2]:text-[25px] [&_h1]:font-bold [&_h2]:font-bold"
                  style={{ fontFamily: MUSEO_BLACK, fontWeight: 900 }}
                  dangerouslySetInnerHTML={{ __html: titleHtml }}
                />
              ) : null}
              {showBody ? (
                <div
                  className="mb-[22px] text-center text-[21px] text-white lg:text-left [&_b]:font-black [&_strong]:font-black"
                  style={{ fontFamily: MUSEO_THIN, fontWeight: 100 }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : null}
              {download ? (
                <div
                  className="mb-[8px] text-center text-[28px] font-bold lg:text-left [&_p]:m-0 [&_p]:text-[28px] [&_p]:font-bold"
                  style={{ fontFamily: MUSEO_BLACK, fontWeight: 900 }}
                  dangerouslySetInnerHTML={{ __html: downloadHtml }}
                />
              ) : null}
            </div>

            {showStoreRow ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 min-[360px]:flex-row min-[360px]:items-start lg:justify-between lg:gap-4">
                {playLinks.length ? (
                  <GooglePlayDownloads imageUrl={gpUrl} links={playLinks} />
                ) : null}
                {asUrl ? (
                  <a
                    href={asLink || '#'}
                    className="inline-flex justify-center transition-opacity hover:opacity-90 lg:ml-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImageWithFallback src={asUrl} alt="" className="h-auto" style={{ maxHeight: '60px' }} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="relative flex flex-col px-8 pb-0 pt-8 lg:col-span-8 lg:px-6 lg:pb-0 lg:pl-6 lg:pr-6 lg:pt-3">
            {showBadge ? (
              <div className="mb-6 flex justify-center lg:justify-start">
                <div
                  className="inline-flex items-center whitespace-nowrap rounded-full px-6 text-xs font-medium shadow-sm [&_p]:m-0"
                  style={{ fontFamily: BODY_SANS, minHeight: '36px', backgroundColor: badgeBg, color: badgeFg }}
                  dangerouslySetInnerHTML={{ __html: badgeHtml }}
                />
              </div>
            ) : null}
            {ussdUrl ? (
              <ImageWithFallback
                src={ussdUrl}
                alt=""
                className="mx-auto mt-auto h-auto w-full max-w-[80%] lg:absolute lg:inset-x-6 lg:bottom-0 lg:mx-0 lg:mt-0 lg:h-full lg:max-w-none lg:w-auto"
                style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
