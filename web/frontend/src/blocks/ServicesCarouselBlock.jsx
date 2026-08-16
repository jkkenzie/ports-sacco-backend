import React, { useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchServicesList } from '../api/services';
import {
  ProductCarouselCard,
  ProductCarouselCardSkeleton,
  ProductCarouselNavButton,
  PRODUCT_CAROUSEL_SLIDE_CLASS,
  PRODUCT_CAROUSEL_STAGE_CLASS,
  PRODUCT_CAROUSEL_TRACK_CLASS,
  PRODUCT_CAROUSEL_VIEWPORT_CLASS,
} from '../components/ProductCarouselCard';

export function ServicesCarouselBlock({
  sectionHeader = 'EXPLORE OUR SERVICES',
  buttonText = 'SERVICES',
  linkText = 'ALL SERVICES',
  linkUrl = '/services',
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
}) {
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
    fetchServicesList({ categoryId: Number(categoryId) || 0, limit: lim })
      .then((data) => {
        if (cancelled) return;
        setItems((Array.isArray(data) ? data : []).slice(0, lim));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[ServicesCarouselBlock] fetch failed', err);
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
      className="w-full px-6 py-10"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: sectionBgColor }}
    >
      <div className="mx-auto max-w-7xl px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="relative mb-10 w-full pt-2">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 lg:flex-row">
            <p className="text-[12px] font-medium" style={{ color: headerTextColor }}>
              {sectionHeader}
            </p>
            <button
              type="button"
              className="relative rounded-full px-8 py-2 text-[12px] font-medium transition-colors lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {buttonText}
            </button>
            <Link
              to={linkUrl || '/services'}
              className="flex items-center gap-[1px] lg:ml-auto"
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              <span
                className="rounded-full border border-[#e8e8e8] px-4 py-2 text-[12px] font-medium transition-colors duration-300"
                style={{
                  color: isLinkHovered ? linkTextHoverColor : linkTextColor,
                  backgroundColor: isLinkHovered ? linkBadgeHoverBgColor : linkBadgeBgColor,
                }}
              >
                {linkText}
              </span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e8e8] transition-colors duration-300"
                style={{ backgroundColor: isLinkHovered ? linkArrowHoverBgColor : linkArrowBgColor }}
              >
                <ArrowRight
                  className="h-4 w-4 transition-colors duration-300"
                  style={{ color: isLinkHovered ? linkArrowHoverColor : linkArrowColor }}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className={PRODUCT_CAROUSEL_STAGE_CLASS}>
          <ProductCarouselNavButton direction="prev" onClick={scrollPrev} ariaLabel="Previous services" />
          <ProductCarouselNavButton direction="next" onClick={scrollNext} ariaLabel="Next services" />

          <div className={PRODUCT_CAROUSEL_VIEWPORT_CLASS} ref={emblaRef}>
            <div className={PRODUCT_CAROUSEL_TRACK_CLASS}>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <ProductCarouselCardSkeleton key={`services-carousel-skeleton-${i}`} />
                  ))
                : items.map((card) => (
                    <div key={card.id || card.slug || card.title} className={PRODUCT_CAROUSEL_SLIDE_CLASS}>
                      <ProductCarouselCard
                        href={card.link}
                        hasDetailPage={card.hasDetailPage === true}
                        title={card.title}
                        description={card.description}
                        imageUrl={card.imageUrl}
                        imageAlt={card.title || 'Service'}
                      />
                    </div>
                  ))}
            </div>
          </div>

          {!isLoading && snaps.length > 0 ? (
            <div className="mt-6 flex justify-center gap-2 lg:hidden">
              {snaps.map((_, dot) => (
                <button
                  type="button"
                  key={`dot-${dot}`}
                  onClick={() => emblaApi && emblaApi.scrollTo(dot)}
                  className={`h-3 w-3 rounded-full transition-all ${dot === selectedIndex ? 'bg-[#EE6E2A]' : 'bg-white/60'}`}
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
