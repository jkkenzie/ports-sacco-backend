import React, { useEffect, useId, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const starFilled =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
const starOutline =
  'M12 5.72l1.76 3.56 3.93.57-2.85 2.78.67 3.92L12 14.5l-3.51 1.85.67-3.92-2.85-2.78 3.93-.57L12 5.72M12 2L8.55 8.63 2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L14 14.14l5-4.87-6.55-.64L12 2z';

function StarRatingDisplay({ value, filledColor, emptyColor }) {
  const fill = str(filledColor) || '#EAB308';
  const empty = str(emptyColor) || '#D1D5DB';
  const n = Math.min(5, Math.max(0, Number(value) || 0));
  const full = Math.floor(n);
  const hasHalf = n % 1 >= 0.5;
  const emptyCount = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex gap-0.5 items-center" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f-${i}`} width="18" height="18" viewBox="0 0 24 24" fill={fill}>
          <path d={starFilled} />
        </svg>
      ))}
      {hasHalf && (
        <span key="h" className="relative inline-block w-[18px] h-[18px] overflow-hidden">
          <svg
            className="absolute left-0 top-0 w-full h-full"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          >
            <path d={starFilled} fill={fill} />
          </svg>
          <svg
            className="absolute left-0 top-0 w-full h-full"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          >
            <path d={starOutline} fill={empty} />
          </svg>
        </span>
      )}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <svg key={`e-${i}`} width="18" height="18" viewBox="0 0 24 24" fill={empty}>
          <path d={starOutline} />
        </svg>
      ))}
    </div>
  );
}

/**
 * Member reviews — carousel of quote cards (CMS-driven).
 */
export function MemberReviewsBlock({
  sectionId,
  anchor,
  useGradient,
  gradientFrom,
  gradientVia,
  gradientTo,
  sectionBgColor,
  topCurveFillColor,
  wavePathFill,
  topBarBg,
  topBarScrollIconOuterColor,
  scrollArrowBg,
  scrollIconColor,
  scrollButtonOuter,
  scrollButtonInner,
  patternImageUrl,
  patternOpacity,
  orchidTintColor,
  badgeLabelHtml,
  subtitleHtml,
  badgeBgColor,
  badgeTextColor,
  subtitleColor,
  showAllReviewsRow,
  allReviewsLabel,
  allReviewsUrl,
  secondaryButtonBorderColor,
  secondaryButtonTextColor,
  quoteTextColor,
  nameColor,
  cardBgColor,
  starFilledColor,
  starEmptyColor,
  carouselArrowBg,
  carouselArrowIconColor,
  dotActiveColor,
  dotInactiveColor,
  maxItems,
  slidesToScroll,
  visibleMobile,
  visibleTablet,
  visibleDesktop,
  carouselLoop,
  reviews,
}) {
  const reactId = useId().replace(/:/g, '');
  const scrollClipId = `clip0_scroll_reviews_${reactId}`;
  const orchidGradId = `member-reviews-orchid-${reactId}`;

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || undefined;

  const bg = str(sectionBgColor) || '#ffffff';
  const useGrad = useGradient === true;
  const gf = str(gradientFrom) || '#FF8C00';
  const gv = str(gradientVia) || '#FF6347';
  const gt = str(gradientTo) || '#800080';
  const gradientBackground = `linear-gradient(to right, ${gf}, ${gv}, ${gt})`;

  /** Small wave SVG path — single solid color only (dedicated attr; avoids SVG gradient id clashes). */
  const waveFill =
    str(wavePathFill) || str(topCurveFillColor) || str(topBarBg) || '#ff6346';

  const patternUrl = str(patternImageUrl);
  const rawPo = Number(patternOpacity);
  const patternOp = Number.isFinite(rawPo) ? Math.min(1, Math.max(0, rawPo)) : 0.3;
  const orchid = str(orchidTintColor) || '#ff7bac';

  const scrollArrowFill =
    str(scrollArrowBg) || str(scrollButtonOuter) || '#ffffff';
  const scrollInRaw = str(scrollButtonInner);
  const scrollIconInnerFill =
    str(scrollIconColor) !== ''
      ? str(scrollIconColor)
      : scrollInRaw === ''
        ? 'transparent'
        : scrollInRaw;
  /** Outer ring override (legacy) → arrow background path (p1076300) */
  const scrollArrowPathFill = str(topBarScrollIconOuterColor) || scrollArrowFill;

  const badgeBg = str(badgeBgColor) || '#EE6E2A';
  const badgeFg = str(badgeTextColor) || '#ffffff';
  const subColor = str(subtitleColor) || '#22ACB6';
  const quoteCol = str(quoteTextColor) || '#6b7280';
  const nameCol = str(nameColor) || '#22ACB6';
  const cardBg = str(cardBgColor) || '#ffffff';
  const arrowBg = str(carouselArrowBg) || '#22ACB6';
  const arrowIcon = str(carouselArrowIconColor) || '#ffffff';
  const dotOn = str(dotActiveColor) || '#EE6E2A';
  const dotOff = str(dotInactiveColor) || '#d1d5db';
  const secBorder = str(secondaryButtonBorderColor) || '#d1d5db';
  const secText = str(secondaryButtonTextColor) || '#22ACB6';

  const list = Array.isArray(reviews) ? reviews : [];
  const lim = Math.max(0, Number(maxItems) || 0);
  const items = useMemo(() => {
    const sliced = lim > 0 ? list.slice(0, lim) : list;
    return sliced.filter((r) => r && (str(r.quote) || str(r.name)));
  }, [list, lim]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const vm = Math.max(1, Number(visibleMobile) || 1);
      const vt = Math.max(1, Number(visibleTablet) || 2);
      const vd = Math.max(1, Number(visibleDesktop) || 3);
      if (window.innerWidth < 768) {
        setVisibleCount(vm);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(vt);
      } else {
        setVisibleCount(vd);
      }
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleMobile, visibleTablet, visibleDesktop]);

  const n = items.length;
  const scrollEff = Math.max(1, Number(slidesToScroll) || 1);
  const vEff = n > 0 ? Math.min(visibleCount, n) : 1;
  const maxIndex = Math.max(0, n - vEff);
  const loop = Boolean(carouselLoop);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, n, visibleCount]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (n === 0) return 0;
      const next = prev + scrollEff;
      if (loop) {
        return next > maxIndex ? 0 : next;
      }
      return Math.min(next, maxIndex);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (n === 0) return 0;
      const next = prev - scrollEff;
      if (loop) {
        return next < 0 ? maxIndex : next;
      }
      return Math.max(next, 0);
    });
  };

  const goToSlide = (index) => {
    const slideStart = index * scrollEff;
    setCurrentIndex(Math.min(slideStart, maxIndex));
  };

  const totalSlides =
    scrollEff === 1 ? maxIndex + 1 : Math.max(1, Math.ceil((maxIndex + 1) / scrollEff));

  const innerWidthPct = n > 0 && vEff > 0 ? (n * 100) / vEff : 100;

  const atStart = !loop && currentIndex <= 0;
  const atEnd = !loop && currentIndex >= maxIndex;

  const badgeHtml = str(badgeLabelHtml);
  const subHtml = str(subtitleHtml);
  //Put value as false so that you view the button to redirect to all reviews
  const showSecondary = showAllReviewsRow !== true;
  const allLabel = str(allReviewsLabel) || 'ALL REVIEWS';
  const allUrl = str(allReviewsUrl);

  const reviewsBody = (
    <>
      <div className="relative flex flex-col lg:flex-row items-center justify-between mb-8 lg:mb-12 gap-4">
            <div className="hidden lg:block flex-1 min-w-0" />
            <div className="flex flex-col items-center justify-center flex-1 min-w-0">
              {badgeHtml ? (
                <div
                  className="px-6 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center shadow-sm [&_p]:m-0"
                  style={{
                    minHeight: '36px',
                    backgroundColor: badgeBg,
                    color: badgeFg,
                  }}
                  dangerouslySetInnerHTML={{ __html: badgeHtml }}
                />
              ) : null}
              {subHtml ? (
                <div
                  className="uppercase mt-2 text-sm font-medium [&_p]:m-0"
                  style={{ color: subColor }}
                  dangerouslySetInnerHTML={{ __html: subHtml }}
                />
              ) : null}
            </div>
            {showSecondary ? (
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                {allUrl ? (
                  <a
                    href={allUrl}
                    className="border rounded-full px-4 py-2 text-xs font-medium uppercase transition-colors hover:bg-gray-50"
                    style={{ borderColor: secBorder, color: secText }}
                  >
                    {allLabel}
                  </a>
                ) : (
                  <span
                    className="border rounded-full px-4 py-2 text-xs font-medium uppercase"
                    style={{ borderColor: secBorder, color: secText }}
                  >
                    {allLabel}
                  </span>
                )}
                <span
                  className="border rounded-full p-2 inline-flex"
                  style={{ borderColor: secBorder, color: secText }}
                  aria-hidden
                >
                  <ChevronRight className="w-5 h-5" />
                </span>
              </div>
            ) : (
              <div className="flex-1 min-w-0 hidden lg:block" />
            )}
          </div>

          {n === 0 ? (
            <p className="text-center text-neutral-500 py-8 text-sm">Add reviews in the WordPress editor.</p>
          ) : (
            <div className="relative px-12 md:px-14">
              <button
                type="button"
                onClick={prevSlide}
                disabled={atStart}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  atStart ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: arrowBg, color: arrowIcon }}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={atEnd}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  atEnd ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: arrowBg, color: arrowIcon }}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    width: `${innerWidthPct}%`,
                    transform: `translateX(-${n > 0 ? (currentIndex / n) * 100 : 0}%)`,
                  }}
                >
                  {items.map((review, index) => (
                    <div
                      key={`${str(review.name)}-${index}`}
                      className="flex flex-col items-center text-center rounded-lg p-6 flex-shrink-0 shadow-sm"
                      style={{
                        width: n > 0 ? `${100 / n}%` : '100%',
                        backgroundColor: cardBg,
                      }}
                    >
                      <p
                        className="italic text-sm sm:text-base leading-relaxed mb-4 flex-grow"
                        style={{ color: quoteCol }}
                      >
                        &ldquo;{str(review.quote)}&rdquo;
                      </p>
                      <div className="mb-3 flex justify-center">
                        <StarRatingDisplay
                          value={Number(review.rating) || 0}
                          filledColor={starFilledColor}
                          emptyColor={starEmptyColor}
                        />
                      </div>
                      <p className="font-bold uppercase text-sm" style={{ color: nameCol }}>
                        {str(review.name)}
                        {str(review.title) ? ` (${str(review.title)})` : ''}
                      </p>
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
    </>
  );

  return (
    <section
      id={sectionDomId}
      className="relative w-full pt-0 overflow-visible"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible z-0 pb-16"
        style={useGrad ? { background: gradientBackground } : { backgroundColor: bg }}
      >
        <div className="relative z-30">
          <div className="relative w-full overflow-hidden flex-shrink-0 -top-8 pb-0 mt-0" style={{ minHeight: '37px' }}>
            <div className="flex justify-center items-end py-0 my-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 116.94 34.5"
                className="h-auto w-[min(30vw,116.94px)] max-w-[116.94px] sm:w-[116.94px]"
                aria-hidden
              >
                <path
                  d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z"
                  fill={waveFill}
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-center -mt-16 mb-0 relative z-10">
            <button
              type="button"
              onClick={scrollToNearestSection}
              className="hover:opacity-80 transition-opacity relative p-4 cursor-pointer"
              style={{ animation: 'float 3s ease-in-out infinite' }}
              aria-label="Scroll section to top"
            >
              <svg
                className="block w-10 h-10 sm:w-14 sm:h-14 max-w-[min(15vw,3.5rem)] h-auto shrink-0"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 57.7882 57.648"
              >
                <g clipPath={`url(#${scrollClipId})`}>
                  <path d={svgPaths.p1076300} fill={scrollArrowPathFill} />
                  <path d={svgPaths.p27278800} fill={scrollIconInnerFill} />
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

        {useGrad ? (
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
              <div className="absolute inset-0" style={{ background: gradientBackground }} />
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

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">{reviewsBody}</div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            {reviewsBody}
          </div>
        )}
      </div>
    </section>
  );
}
