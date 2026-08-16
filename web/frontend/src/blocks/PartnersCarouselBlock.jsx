import React, { useEffect, useId, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PartnersCarouselBlock({
  sectionId,
  anchor,
  useGradient,
  gradientFrom,
  gradientVia,
  gradientTo,
  sectionBgColor,
  topBarBg,
  topBarUseGradient,
  topBarGradientFrom,
  topBarGradientVia,
  topBarGradientTo,
  curveAccentColor,
  topBarScrollIconOuterColor,
  topBarColor,
  scrollButtonOuter,
  scrollButtonInner,
  kickerText,
  badgeText,
  kickerColor,
  badgeBgColor,
  badgeTextColor,
  carouselArrowBg,
  carouselArrowIconColor,
  dotActiveColor,
  dotInactiveColor,
  maxItems,
  showPartnerCount,
  partnerCountSuffix,
  partners,
}) {
  const reactId = useId().replace(/:/g, '');
  const scrollClipId = `clip0_scroll_partners-${reactId}`;
  const clipPartnersTop = `clip-partners-top-${reactId}`;
  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || undefined;

  const bg = str(sectionBgColor) || '#ffffff';
  const useGrad =
    useGradient === undefined || useGradient === null ? true : Boolean(useGradient);
  const gf = str(gradientFrom) || '#00B2E0';
  const gv = str(gradientVia) || '#00AFBB';
  const gt = str(gradientTo) || '#00AB81';
  /* Top bar strip: solid (Newsletter-style) or optional horizontal gradient */
  const barBg = str(topBarBg) || str(topBarColor) || '#F5F4EE';
  const topBarGradOn =
    topBarUseGradient === undefined || topBarUseGradient === null
      ? false
      : Boolean(topBarUseGradient);
  const tbf = str(topBarGradientFrom) || '#F5F4EE';
  const tbv = str(topBarGradientVia) || '#E8E6E0';
  const tbt = str(topBarGradientTo) || '#F5F4EE';
  const topBarStripStyle = topBarGradOn
    ? { minHeight: '37px', background: `linear-gradient(to right, ${tbf}, ${tbv}, ${tbt})` }
    : { minHeight: '37px', backgroundColor: barBg };
  /** SVG fill for the curved path: same horizontal stops as the top bar strip */
  const topBarPathGradientId = `partners-topbar-path-grad-${reactId}`;
  const topBarPathFill = `url(#${topBarPathGradientId})`;

  const curve = str(curveAccentColor) || '#00AFBB';
  /* Match MobileAppBlock scroll button defaults */
  const scrollOut = str(scrollButtonOuter) || '#ffffff';
  const scrollIn = str(scrollButtonInner) || '#22ACB6';
  const scrollIconOuterFill = str(topBarScrollIconOuterColor) || scrollOut;

  const kickerHtml = str(kickerText);
  const badgeHtml = str(badgeText);
  const kc = str(kickerColor) || '#22ACB6';
  const badgeBg = str(badgeBgColor) || '#EE6E2A';
  const badgeFg = str(badgeTextColor) || '#ffffff';
  const arrowBg = str(carouselArrowBg) || '#00AFBB';
  const arrowIcon = str(carouselArrowIconColor) || '#ffffff';
  const dotOn = str(dotActiveColor) || '#EE6E2A';
  const dotOff = str(dotInactiveColor) || '#d1d5db';

  const list = Array.isArray(partners) ? partners : [];
  const lim = Math.max(0, Number(maxItems) || 0);
  const items = useMemo(() => {
    const sliced = lim > 0 ? list.slice(0, lim) : list;
    return sliced.filter((p) => p && str(p.imageUrl));
  }, [list, lim]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [scrollCount, setScrollCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 480) {
        setVisibleCount(1);
        setScrollCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
        setScrollCount(1);
      } else {
        setVisibleCount(4);
        setScrollCount(4);
      }
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const n = items.length;
  const vEff = n > 0 ? Math.min(visibleCount, n) : 1;
  const scrollEff = n > 0 ? Math.min(scrollCount, Math.max(1, n)) : 1;
  const maxIndex = Math.max(0, n - vEff);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, n, visibleCount]);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + scrollEff, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - scrollEff, 0));
  };

  const goToSlide = (index) => {
    const slideIndex = index * scrollEff;
    setCurrentIndex(Math.min(slideIndex, maxIndex));
  };

  const totalSlides =
    scrollEff === 1 ? maxIndex + 1 : Math.max(1, Math.ceil((maxIndex + 1) / scrollEff));

  const innerWidthPct = n > 0 && vEff > 0 ? (n * 100) / vEff : 100;

  const countSuffix = str(partnerCountSuffix) || 'partners';
  const showCount = Boolean(showPartnerCount) && n > 0;

  return (
    <section
      id={sectionDomId}
      className="relative w-full overflow-x-hidden pt-0 pb-0 overflow-visible"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden pb-16"
        style={
          useGrad
            ? { background: `linear-gradient(to right, ${gf}, ${gv}, ${gt})` }
            : { backgroundColor: bg }
        }
      >
        {/* Curved top bar — same markup as NewsletterBlock */}
        <div className="relative w-full overflow-hidden flex-shrink-0 mt-[-4px]" style={topBarStripStyle}>
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
              <linearGradient
                id={topBarPathGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="objectBoundingBox"
              >
                <stop
                  offset="0%"
                  stopColor={topBarGradOn ? tbf : barBg}
                />
                <stop
                  offset="50%"
                  stopColor={topBarGradOn ? tbv : barBg}
                />
                <stop
                  offset="100%"
                  stopColor={topBarGradOn ? tbt : barBg}
                />
              </linearGradient>
              <clipPath id={clipPartnersTop}>
                <rect x="484.39" y="0" width="120" height="38.01" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipPartnersTop})`}>
              <rect x="422.93" width="240.31" height="38.01" style={{ fill: curve }} />
              <path
                d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
                fill={topBarPathFill}
              />
            </g>
          </svg>
        </div>

      {/* Scroll + header row — overlap matches NewsletterBlock (-mt-7) */}
      <div
        className="max-w-7xl mx-auto px-4 relative z-10 -mt-7 mb-0"
        style={{ animation: 'fadeInUp 0.8s ease-out' }}
      >
        {/* Kicker (left, bottom) | scroll + badge (center) | partner count (right, bottom) */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-4 gap-y-4 mb-8 lg:mb-12 pt-0 lg:items-end`}
        >
          {kickerHtml ? (
            <div className="min-w-0 w-full justify-self-start self-end lg:max-w-[100%] lg:pr-4">
              <div
                className="uppercase text-left [&_p]:m-0"
                style={{
                  fontFamily: 'Sans-serif, Helvetica, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: kc,
                }}
                dangerouslySetInnerHTML={{ __html: kickerHtml }}
              />
            </div>
          ) : (
            <div className="min-w-0 hidden lg:block" aria-hidden="true" />
          )}

          {/* Scroll + badge: same structure as MobileAppBlock (flex-col, gap, badge classes) */}
          <div
            className={`flex flex-col items-center justify-self-center self-end shrink-0 mb-0 ${
              badgeHtml ? 'gap-[50px]' : ''
            }`}
          >
            <button
              type="button"
              onClick={scrollToNearestSection}
              className="hover:opacity-80 transition-opacity relative p-3 sm:p-4 cursor-pointer shrink-0"
              style={{ animation: 'float 3s ease-in-out infinite' }}
              aria-label="Scroll section to top"
            >
              <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
                <g clipPath={`url(#${scrollClipId})`}>
                  <path d={svgPaths.p1076300} fill={scrollIconOuterFill} />
                  <path d={svgPaths.p27278800} fill={scrollIn} />
                </g>
                <defs>
                  <clipPath id={scrollClipId}>
                    <rect fill="white" height="57.648" width="57.7882" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            {badgeHtml ? (
              <div
                className="px-6 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center shadow-sm [&_p]:m-0"
                style={{
                  fontFamily: 'Sans-serif, Helvetica, sans-serif',
                  minHeight: '36px',
                  backgroundColor: badgeBg,
                  color: badgeFg,
                }}
                dangerouslySetInnerHTML={{ __html: badgeHtml }}
              />
            ) : null}
          </div>

          <div className="min-w-0 flex justify-center lg:justify-end self-end w-full">
            {showCount ? (
              <span className="text-sm text-neutral-600">{n} {countSuffix}</span>
            ) : null}
          </div>
        </div>

        {n === 0 ? (
          <p className="text-center text-neutral-500 py-8 text-sm">Add partner logos in the WordPress editor.</p>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: arrowBg,
                color: arrowIcon,
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: arrowBg,
                color: arrowIcon,
              }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="overflow-hidden px-12 md:px-16">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  width: `${innerWidthPct}%`,
                  transform: `translateX(-${n > 0 ? (currentIndex / n) * 100 : 0}%)`,
                }}
              >
                {items.map((p, index) => (
                  <div
                    key={`${str(p.imageUrl)}-${index}`}
                    className="flex items-center justify-center h-32 px-2 flex-shrink-0"
                    style={{
                      width: n > 0 ? `${100 / n}%` : '100%',
                    }}
                  >
                    <ImageWithFallback
                      src={str(p.imageUrl)}
                      alt={str(p.alt) || 'Partner'}
                      className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {totalSlides > 1 ? (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => {
                  const slideStartIndex = index * scrollEff;
                  const isActive =
                    currentIndex >= slideStartIndex && currentIndex < slideStartIndex + scrollEff;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToSlide(index)}
                      className="w-3 h-3 rounded-full transition-all border"
                      style={{
                        backgroundColor: isActive ? dotOn : '#ffffff',
                        borderColor: isActive ? dotOn : dotOff,
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
