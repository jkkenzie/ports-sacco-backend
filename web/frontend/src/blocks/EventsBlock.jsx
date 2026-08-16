import React, { useId } from 'react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const BODY_SANS = 'Sans-serif, Helvetica, sans-serif';
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

/**
 * Events banner — full-width section gradient from CMS, Newsletter-style top wave + scroll,
 * then optional orchid/pattern and event content.
 */
export function EventsBlock({
  sectionId,
  anchor,
  gradientFrom,
  gradientVia,
  gradientTo,
  topCurveFillColor,
  topBarBg,
  topBarUseGradient,
  topBarGradientFrom,
  topBarGradientVia,
  topBarGradientTo,
  topBarScrollIconOuterColor,
  scrollButtonOuter,
  scrollButtonInner,
  patternImageUrl,
  patternOpacity,
  orchidTintColor,
  logoImageUrl,
  logoAlt,
  eventTitle,
  eventSubtitle,
  dayName,
  dayNumber,
  monthName,
  year,
  venueTitle,
  timeLine,
  bannerTextColor,
}) {
  const reactId = useId().replace(/:/g, '');
  const clipTop = `clip-events-top-${reactId}`;
  const clipScroll = `clip0_scroll_events_${reactId}`;
  const orchidGradId = `events-orchid-gradient-${reactId}`;
  const topBarBumpGradId = `events-topbar-bump-${reactId}`;

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || undefined;

  const gf = str(gradientFrom) || '#FF8C00';
  const gv = str(gradientVia) || '#FF6347';
  const gt = str(gradientTo) || '#800080';
  const gradientBackground = `linear-gradient(to right, ${gf}, ${gv}, ${gt})`;

  const barBg = str(topBarBg) || str(topCurveFillColor) || '#ff6346';
  const topBarGradOn =
    topBarUseGradient === undefined || topBarUseGradient === null
      ? false
      : Boolean(topBarUseGradient);
  const tbf = str(topBarGradientFrom) || '#ff6346';
  const tbv = str(topBarGradientVia) || '#FF6347';
  const tbt = str(topBarGradientTo) || '#ff6346';

  /** Center bump: SVG gradient from CMS when top-bar gradient on, else solid section via */
  const bumpFill = topBarGradOn ? `url(#${topBarBumpGradId})` : gv;

  const scrollOut = str(scrollButtonOuter) || '#ffffff';
  const scrollInRaw = str(scrollButtonInner);
  const scrollIn = scrollInRaw === '' ? 'transparent' : scrollInRaw;
  const scrollIconOuterFill = str(topBarScrollIconOuterColor) || scrollOut;

  const patternUrl = str(patternImageUrl);
  const rawPo = Number(patternOpacity);
  const patternOp = Number.isFinite(rawPo) ? Math.min(1, Math.max(0, rawPo)) : 0.3;

  const logoUrl = str(logoImageUrl);
  const logoAltText = str(logoAlt);

  const orchid = str(orchidTintColor) || '#ff7bac';
  const textColor = str(bannerTextColor) || '#ffffff';

  const title = str(eventTitle);
  const subtitle = str(eventSubtitle);
  const dName = str(dayName);
  const dNum = str(dayNumber);
  const mName = str(monthName);
  const y = str(year);
  const venue = str(venueTitle);
  const time = str(timeLine);

  const textStyle = { color: textColor };
  const ruleColor = textColor;

  return (
    <section
      id={sectionDomId}
      className="relative w-full overflow-x-hidden pt-0 pb-0 overflow-visible"
      style={{ fontFamily: BODY_SANS }}
    >
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible z-0 pb-16"
        style={{ background: gradientBackground }}
      >
        {/* Top bar + scroll — same structure as NewsletterBlock (wide SVG, -mt-7 on button) */}
        <div className="relative z-30">
          <div
            className="relative w-full overflow-hidden flex-shrink-0"
            style={{ backgroundColor: barBg, minHeight: '37px' }}
          >
            <svg
              viewBox="0 0 1088.78 38.01"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto absolute left-1/2"
              style={{
                display: 'block',
                minWidth: '1089px',
                width: '1089px',
                transform: 'translateX(-50%)',
              }}
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <clipPath id={clipTop}>
                  <rect x="484.39" y="0" width="120" height="38.01" />
                </clipPath>
                <linearGradient
                  id={topBarBumpGradId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                  gradientUnits="objectBoundingBox"
                >
                  <stop offset="0%" stopColor={tbf} />
                  <stop offset="50%" stopColor={tbv} />
                  <stop offset="100%" stopColor={tbt} />
                </linearGradient>
              </defs>
              <g clipPath={`url(#${clipTop})`}>
                <rect x="422.93" width="240.31" height="38.01" style={{ fill: bumpFill }} />
                <path
                  d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
                  style={{ fill: barBg }}
                />
              </g>
            </svg>
          </div>

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
                    <path d={svgPaths.p1076300} fill={scrollIconOuterFill} />
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
        </div>

        <div
          className="relative z-10 w-screen min-h-[200px] mt-6 py-3 overflow-visible flex flex-col justify-center"
          style={{
            marginLeft: 'calc(50% - 50vw)',
            marginRight: 'calc(50% - 50vw)',
            animation: 'fadeInUp 0.8s ease-out',
            background: gradientBackground,
          }}
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute inset-0" style={{ background: gradientBackground }} aria-hidden />
            <svg
              className="absolute inset-0 h-full w-full"
              style={{ mixBlendMode: 'multiply' }}
              viewBox="0 0 1078.61 190.03"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id={orchidGradId}
                  x1="232"
                  y1="-570.98"
                  x2="1310.61"
                  y2="-570.98"
                  gradientTransform="translate(-232 666)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor={orchid} />
                  <stop offset="0.22" stopColor={orchid} stopOpacity="0.76" />
                  <stop offset="0.6" stopColor={orchid} stopOpacity="0.36" />
                  <stop offset="0.87" stopColor={orchid} stopOpacity="0.1" />
                  <stop offset="1" stopColor={orchid} stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${orchidGradId})`} />
            </svg>
          </div>

          {patternUrl ? (
            <div
              className="absolute pointer-events-none z-[15]"
              style={{
                top: '-60%',
                right: '-70%',
                width: '140%',
                height: '140%',
              }}
            >
              <img
                src={patternUrl}
                alt=""
                className="w-full h-full object-contain"
                style={{ opacity: patternOp, mixBlendMode: 'multiply' }}
              />
            </div>
          ) : null}

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center">
            <div
              className="w-full rounded-lg overflow-hidden flex flex-col sm:flex-row flex-wrap items-center text-left"
              style={{ gap: '15px', ...textStyle }}
            >
              {logoUrl ? (
                <div
                  className="relative z-20 flex flex-col justify-center items-start flex-none flex-shrink-0 mr-3"
                  style={{ mixBlendMode: 'normal' }}
                >
                  <ImageWithFallback
                    src={logoUrl}
                    alt={logoAltText}
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                </div>
              ) : null}

              {(title || subtitle) && (
                <div className="flex flex-col justify-center flex-none flex-shrink-0">
                  {title ? (
                    <span
                      className="font-bold tracking-tight leading-none uppercase"
                      style={{
                        fontFamily: MUSEO_BLACK,
                        fontWeight: 900,
                        fontSize: 'clamp(44px, 12vw, 96px)',
                      }}
                    >
                      {title}
                    </span>
                  ) : null}
                  {subtitle ? (
                    <span className="uppercase tracking-wider mt-1" style={{ fontFamily: BODY_SANS, fontSize: '14px' }}>
                      {subtitle}
                    </span>
                  ) : null}
                </div>
              )}

              {(dName || dNum || mName || y) && (
                <div className="flex flex-none flex-shrink-0 items-stretch">
                  <div
                    className="flex-shrink-0 w-px self-stretch border-l border-dotted ml-6 mr-6"
                    style={{ borderLeftWidth: '2px', borderColor: ruleColor }}
                  />
                  <div className="flex flex-col justify-center flex-none flex-shrink-0">
                    <div className="flex items-end gap-0">
                      <div className="flex flex-col items-start" style={{ width: 'fit-content' }}>
                        {dName ? (
                          <span
                            className="uppercase leading-none font-bold"
                            style={{
                              fontFamily: MUSEO_BLACK,
                              fontWeight: 900,
                              fontSize: '37px',
                              marginBottom: '2px',
                            }}
                          >
                            {dName}
                          </span>
                        ) : null}
                        {dNum ? (
                          <span
                            className="font-bold leading-none block"
                            style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, fontSize: '117px' }}
                          >
                            {dNum}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start" style={{ width: 'fit-content' }}>
                        {mName ? (
                          <span
                            className="uppercase leading-none font-bold block"
                            style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, fontSize: '83px' }}
                          >
                            {mName}
                          </span>
                        ) : null}
                        {y ? (
                          <span
                            className="font-bold leading-none block"
                            style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, fontSize: '69px' }}
                          >
                            {y}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 w-px self-stretch border-l border-dotted ml-5 mr-0"
                    style={{ borderLeftWidth: '2px', borderColor: ruleColor }}
                  />
                </div>
              )}

              {(venue || time) && (
                <div className="flex flex-col justify-center items-center flex-none flex-shrink-0 px-3">
                  {venue ? (
                    <span
                      className="uppercase tracking-wider text-center w-full block"
                      style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, fontSize: '63px' }}
                    >
                      {venue}
                    </span>
                  ) : null}
                  <div
                    className="border-b border-dotted w-full my-3"
                    style={{ borderBottomWidth: '2px', borderColor: ruleColor }}
                  />
                  {time ? (
                    <span
                      className="uppercase tracking-wider text-center w-full block whitespace-nowrap"
                      style={{ fontFamily: MUSEO_BLACK, fontWeight: 900, fontSize: '32px' }}
                    >
                      {time}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
