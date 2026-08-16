import React, { useEffect, useId, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchEventsList } from '../api/events';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SectionTransitionWave } from '../components/SectionTransitionWave';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

/** Matches `NewsEventsSection.jsx` — CalendarIcon */
function CalendarIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12.15 12.13" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M1.87.92V0h.92v.9h6.55v-.91h.93v.92c.15,0,.27,0,.4,0,.87,0,1.47.61,1.47,1.47,0,2.76,0,5.52,0,8.27,0,.85-.62,1.46-1.47,1.46-3.07,0-6.15,0-9.22,0-.84,0-1.45-.62-1.45-1.46C0,7.9,0,5.13,0,2.36c0-.82.61-1.43,1.43-1.44.14,0,.27,0,.44,0ZM.94,4.67s0,.07,0,.09c0,1.97,0,3.94,0,5.91,0,.34.19.52.54.52,3.06,0,6.11,0,9.17,0,.41,0,.57-.17.57-.58,0-1.92,0-3.84,0-5.75,0-.06,0-.13,0-.19H.94ZM10.28,2.78h-.94v-.91H2.8v.91h-.93v-.92c-.14,0-.26,0-.38,0-.38,0-.56.17-.56.55,0,.24,0,.48,0,.71,0,.19,0,.39,0,.59h10.28c0-.49,0-.97,0-1.44,0-.19-.12-.35-.32-.39-.19-.03-.4,0-.61,0v.9Z"
        style={{ fill: '#f06e2a' }}
      />
    </svg>
  );
}

/** Matches `NewsEventsSection.jsx` — UserIcon */
function UserIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12.15 12.13" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g>
        <g>
          <path d="M6.7,5.65c.66,0,1.21-.54,1.21-1.21s-.54-1.21-1.21-1.21-1.21.54-1.21,1.21.54,1.21,1.21,1.21Z" style={{ fill: '#ee6e2a' }} />
          <path d="M6.7,6.08c-1.23,0-2.26.84-2.57,1.97.3.47,1.34.81,2.57.81s2.26-.35,2.57-.81c-.3-1.13-1.34-1.97-2.57-1.97Z" style={{ fill: '#ee6e2a' }} />
        </g>
        <path d="M4.29,4.99c.51,0,.93-.42.93-.93s-.42-.93-.93-.93-.93.42-.93.93.42.93.93.93Z" style={{ fill: '#ee6e2a' }} />
        <path d="M5.55,5.75c-.35-.27-.79-.44-1.26-.44-.95,0-1.75.65-1.98,1.52.17.27.67.49,1.3.58.36-.82,1.07-1.44,1.95-1.67Z" style={{ fill: '#ee6e2a' }} />
      </g>
      <circle cx="6.07" cy="6.07" r="5.41" style={{ fill: 'none', stroke: '#ee6e2a', strokeMiterlimit: 10, strokeWidth: '0.5px' }} />
    </svg>
  );
}

export function EventsCarouselBlock({
  sectionHeader = 'CELEBRATE, EXPLORE AND SHARE OUR INCREDIBLE JOURNEYS OF PROSPERITY.',
  buttonText = 'LATEST EVENTS',
  linkText = 'ALL EVENTS',
  linkUrl = '/events',
  readMoreLabel = 'READ MORE',
  categoryId = 0,
  maxItems = 9,
  autoplayDelayMs = 3500,
  sectionBgColor = '#F5F4EE',
  headerTextColor = '#22ACB6',
  buttonBgColor = '#EE6E2A',
  buttonTextColor = '#ffffff',
  linkTextColor = '#22ACB6',
  linkTextHoverColor = '#EE6E2A',
  linkBadgeBgColor = '#ffffff',
  linkBadgeHoverBgColor = '#ffffff',
  linkArrowBgColor = '#ffffff',
  linkArrowHoverBgColor = '#EE6E2A',
  linkArrowColor = '#22ACB6',
  linkArrowHoverColor = '#ffffff',
  arrowButtonBgColor = '#00AFBB',
  arrowButtonIconColor = '#ffffff',
  metaTextColor = '#808080',
  cardTitleColor = '#808080',
  cardTitleHoverColor = '#22ACB6',
  readMoreTextColor = '#ee6e2a',
  readMoreHoverColor = '#22aab7',
  readMoreArrowBg = '#ee6e2a',
  readMoreArrowHoverBg = '#22aab7',
  carouselNavArrowColor = '#82cdcb',
  dotActiveColor = '#EE6E2A',
  dotInactiveColor = 'rgba(255,255,255,0.6)',
}) {
  const clipUid = useId().replace(/:/g, '');
  const topClipPathId = `clip-events-carousel-top-${clipUid}`;
  const scrollClipId = `clip0_scroll_events_carousel_${clipUid}`;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const autoplayDelay = Math.max(800, Number(autoplayDelayMs) || 3500);
  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: autoplayDelay, stopOnMouseEnter: true, stopOnInteraction: false }),
    [autoplayDelay]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: false,
      containScroll: 'trimSnaps',
    },
    [autoplayPlugin]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const lim = Math.max(3, Number(maxItems) || 9);
    fetchEventsList({ categoryId: Number(categoryId) || 0, limit: lim })
      .then((data) => {
        if (cancelled) return;
        setItems((Array.isArray(data) ? data : []).slice(0, lim));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[EventsCarouselBlock] fetch failed', err);
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId, maxItems]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const snaps = emblaApi ? emblaApi.scrollSnapList() : [];

  return (
    <section
      className="relative z-10 w-full pb-10 pt-0 sm:px-6"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: sectionBgColor }}
    >
      {/* Transparent top curve: pulls up over the previous block so its background shows through */}
      <div
        className="pointer-events-none relative -mt-8 w-screen shrink-0 overflow-hidden sm:-mt-10 lg:-mt-12 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
        style={{ backgroundColor: 'transparent', minHeight: '38px' }}
      >
        <svg
          viewBox="0 0 1088.78 38.01"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-1/2 h-auto"
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
            <clipPath id={topClipPathId}>
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${topClipPathId})`}>
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: sectionBgColor }} />
            <path
              d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
              fill="transparent"
            />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="relative flex justify-center overflow-visible -mt-12 sm:-mt-14 lg:-mt-16 mb-5">
          <div
            className="absolute left-1/2 z-0 w-[117px] shrink-0 -translate-x-1/2 pointer-events-none top-[-20px] sm:top-[-12px] lg:top-[-5px]"
            aria-hidden
          >
            <SectionTransitionWave fill="rgb(245, 244, 238)" />
          </div>
          <button
            type="button"
            onClick={scrollToNearestSection}
            className="hover:opacity-80 transition-opacity relative z-10 p-4 cursor-pointer"
            style={{ animation: 'float 3s ease-in-out infinite' }}
            aria-label="Scroll section to top"
          >
            <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
              <g clipPath={`url(#${scrollClipId})`}>
                <path d={svgPaths.p1076300} fill={arrowButtonBgColor} />
                <path d={svgPaths.p27278800} fill={arrowButtonIconColor} />
              </g>
              <defs>
                <clipPath id={scrollClipId}>
                  <rect fill="white" height="57.648" width="57.7882" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>

        <div className="relative w-full mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-2 sm:px-4 max-w-7xl mx-auto">
            <p
              className="text-[11px] sm:text-[12px] font-medium text-center lg:text-left w-full lg:w-auto lg:max-w-[40%] lg:pr-4 order-2 lg:order-1"
              style={{ color: headerTextColor }}
            >
              {sectionHeader}
            </p>
            <button
              type="button"
              className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0 px-6 sm:px-8 py-2 rounded-full text-[11px] sm:text-[12px] font-medium transition-colors order-1 lg:order-none whitespace-nowrap"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {buttonText}
            </button>
            <Link
              to={linkUrl || '/events'}
              className="flex items-center gap-[1px] lg:ml-auto order-3 justify-center lg:justify-end w-full lg:w-auto"
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              <span
                className="text-[11px] sm:text-[12px] font-medium border border-[#e8e8e8] px-3 sm:px-4 py-2 rounded-full transition-colors duration-300"
                style={{
                  color: isLinkHovered ? linkTextHoverColor : linkTextColor,
                  backgroundColor: isLinkHovered ? linkBadgeHoverBgColor : linkBadgeBgColor,
                }}
              >
                {linkText}
              </span>
              <div
                className="border border-[#e8e8e8] rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-300 shrink-0"
                style={{ backgroundColor: isLinkHovered ? linkArrowHoverBgColor : linkArrowBgColor }}
              >
                <ArrowRight
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: isLinkHovered ? linkArrowHoverColor : linkArrowColor }}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="relative px-0 sm:px-2 lg:px-6">
          <button
            type="button"
            onClick={scrollPrev}
            className="hidden lg:flex absolute -left-8 xl:-left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hover:bg-white hover:shadow-lg rounded-full items-center justify-center transition-all"
            aria-label="Previous events"
          >
            <svg className="w-5 h-5" viewBox="0 0 10.31 16.11" fill="none">
              <path
                d="M6.51.66L.65,6.51C.24,6.93,0,7.5,0,8.08s.24,1.16.65,1.58l5.8,5.8c.87.87,2.28.87,3.15,0,.87-.87.87-2.28,0-3.16l-4.22-4.22,4.28-4.27c.87-.87.87-2.28,0-3.16C9.23.22,8.65,0,8.08,0s-1.14.22-1.58.66"
                fill={carouselNavArrowColor}
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className="hidden lg:flex absolute -right-8 xl:-right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hover:bg-white hover:shadow-lg rounded-full items-center justify-center transition-all"
            aria-label="Next events"
          >
            <svg className="w-5 h-5" viewBox="0 0 10.31 16.11" fill="none" style={{ transform: 'scaleX(-1)' }}>
              <path
                d="M6.51.66L.65,6.51C.24,6.93,0,7.5,0,8.08s.24,1.16.65,1.58l5.8,5.8c.87.87,2.28.87,3.15,0,.87-.87.87-2.28,0-3.16l-4.22-4.22,4.28-4.27c.87-.87.87-2.28,0-3.16C9.23.22,8.65,0,8.08,0s-1.14.22-1.58.66"
                fill={carouselNavArrowColor}
              />
            </svg>
          </button>

          <div className="mx-[-4px] sm:mx-0 overflow-hidden px-2 sm:px-4 lg:px-8" ref={emblaRef}>
            <div className="flex items-stretch gap-6 sm:gap-0 sm:-mr-8 lg:-mr-10">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`event-carousel-skeleton-${i}`}
                      className="min-w-0 flex flex-col self-stretch flex-[0_0_100%] sm:flex-[0_0_calc((100%-2rem)/2)] lg:flex-[0_0_calc((100%-5rem)/3)] sm:mr-8 lg:mr-10"
                    >
                      <div className="bg-transparent animate-pulse">
                        <div className="relative w-full h-48 mb-4 rounded-[20px] bg-[#dfe5ea]" />
                        <div className="px-4 pb-4 space-y-3">
                          <div className="h-3 w-2/3 rounded bg-[#e7ebef]" />
                          <div className="h-6 w-full rounded bg-[#dfe5ea]" />
                          <div className="h-4 w-1/3 rounded bg-[#e7ebef]" />
                        </div>
                      </div>
                    </div>
                  ))
                : items.map((card) => {
                    const href = card.link || '#';
                    const key = card.id || card.slug || card.title;
                    const dateStr = card.date || '';
                    const authorStr = card.author ? String(card.author).toUpperCase() : '';
                    const authorLine = authorStr ? `BY ${authorStr}` : '';

                    const cardStyle = {
                      animation: 'slideInCard 0.6s ease-out',
                      ['--evt-ct']: cardTitleColor,
                      ['--evt-cth']: cardTitleHoverColor,
                      ['--evt-rm']: readMoreTextColor,
                      ['--evt-rmh']: readMoreHoverColor,
                      ['--evt-rma']: readMoreArrowBg,
                      ['--evt-rmah']: readMoreArrowHoverBg,
                    };

                    const cardClassName =
                      'group block h-full cursor-pointer rounded-[20px] no-underline outline-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(34,172,182,0.15)] focus-visible:ring-2 focus-visible:ring-[#22ACB6] focus-visible:ring-offset-2';

                    const inner = (
                      <>
                        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-[20px]">
                          {card.imageUrl ? (
                            <ImageWithFallback
                              src={card.imageUrl}
                              alt={card.title || 'Event'}
                              className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="w-full h-full rounded-[20px] bg-[#dfe5ea]" />
                          )}
                        </div>

                        <div className="px-4 pb-4">
                          <div
                            className="flex items-center gap-2 mb-3 text-xs"
                            style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: metaTextColor }}
                          >
                            <CalendarIcon />
                            {dateStr ? <span>{dateStr}</span> : null}
                            <UserIcon />
                            {authorLine ? <span>{authorLine}</span> : null}
                          </div>

                          <h3
                            className="text-lg font-bold mb-4 transition-colors duration-200 text-[color:var(--evt-ct)] group-hover:text-[color:var(--evt-cth)]"
                            style={{ fontFamily: 'Museo, sans-serif', fontWeight: 900 }}
                          >
                            {card.title}
                          </h3>

                          <div
                            className="flex items-center gap-2 text-sm font-bold transition-colors duration-200 text-[color:var(--evt-rm)] group-hover:text-[color:var(--evt-rmh)]"
                            style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
                          >
                            {readMoreLabel}
                            <div className="rounded-full w-5 h-5 flex shrink-0 items-center justify-center transition-colors duration-200 bg-[color:var(--evt-rma)] group-hover:bg-[color:var(--evt-rmah)]">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </>
                    );

                    return (
                      <div
                        key={key}
                        className="min-w-0 flex flex-col self-stretch flex-[0_0_100%] sm:flex-[0_0_calc((100%-2rem)/2)] lg:flex-[0_0_calc((100%-5rem)/3)] sm:mr-8 lg:mr-10"
                      >
                        {href.startsWith('/') ? (
                          <Link to={href} className={cardClassName} style={cardStyle}>
                            {inner}
                          </Link>
                        ) : (
                          <a href={href} className={cardClassName} style={cardStyle}>
                            {inner}
                          </a>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>

          {!isLoading && snaps.length > 0 ? (
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {snaps.map((_, dot) => (
                <button
                  key={`ev-dot-${dot}`}
                  type="button"
                  onClick={() => emblaApi && emblaApi.scrollTo(dot)}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    backgroundColor: dot === selectedIndex ? dotActiveColor : dotInactiveColor,
                  }}
                  aria-label={`Go to slide ${dot + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
