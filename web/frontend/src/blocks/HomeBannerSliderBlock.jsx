import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Bundled fallback when CMS has no images (same asset as legacy HeroSection). */
// eslint-disable-next-line import/no-unresolved -- Vite resolves project asset
import fallbackBanner from '../assets/image/portsbanner.jpg';

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

function normalizeSlides(raw) {
  const list = Array.isArray(raw) ? raw : [];
  const out = list
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({
      imageId: Number(s.imageId) || 0,
      imageUrl: s.imageUrl != null ? String(s.imageUrl).trim() : '',
      alt: s.alt != null ? String(s.alt) : '',
      embedHtml: s.embedHtml != null ? String(s.embedHtml) : '',
    }))
    .filter((s) => s.imageUrl !== '' || s.imageId > 0);
  if (out.length === 0) {
    return [
      {
        imageId: 0,
        imageUrl: typeof fallbackBanner === 'string' ? fallbackBanner : fallbackBanner?.src || '',
        alt: 'Welcome',
        embedHtml: '',
      },
    ];
  }
  return out;
}

/**
 * Home hero image slider (Gutenberg: custom/home-banner-slider).
 */
export function HomeBannerSliderBlock({
  sectionId,
  anchor,
  slides,
  heroBg,
  dotBarBg,
  arrowBg,
  arrowIconColor,
  transitionMs,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const containerRef = useRef(null);

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || 'hero';

  const topBg = str(heroBg) || '#1BB5B5';
  const dotsBg = str(dotBarBg) || '#22acb6';
  const arrBg = str(arrowBg) || 'rgba(255,255,255,0.8)';
  const arrIcon = str(arrowIconColor) || '#1BB5B5';
  const duration = Math.max(200, Math.min(2000, Number(transitionMs) || 700));

  const slideList = normalizeSlides(slides);

  useEffect(() => {
    setCurrentSlide((c) => Math.min(c, Math.max(0, slideList.length - 1)));
  }, [slideList.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideList.length);
  }, [slideList.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length);
  }, [slideList.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStartRef.current - e.clientX;
    if (diff > 75) nextSlide();
    if (diff < -75) prevSlide();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [nextSlide, prevSlide]);

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transition = reduceMotion ? 'none' : `transform ${duration}ms ease-in-out`;

  return (
    <div
      id={sectionDomId}
      className="relative overflow-hidden"
      style={{ animation: 'fadeInUp 0.8s ease-out', backgroundColor: topBg }}
    >
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero banner"
        tabIndex={0}
        className="relative w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={() => {}}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition,
          }}
        >
          {slideList.map((slide, index) => (
            <div key={`${slide.imageUrl || slide.imageId}-${index}`} className="relative min-w-full shrink-0">
              <img
                src={slide.imageUrl || (typeof fallbackBanner === 'string' ? fallbackBanner : fallbackBanner?.src)}
                alt={str(slide.alt) || 'Banner'}
                className="pointer-events-none h-auto w-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              {str(slide.embedHtml) ? (
                <div
                  className="pointer-events-none absolute inset-0 flex items-end justify-center p-4 md:p-8 [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: slide.embedHtml }}
                />
              ) : null}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all md:flex"
          style={{ backgroundColor: arrBg, color: arrIcon }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all md:flex"
          style={{ backgroundColor: arrBg, color: arrIcon }}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex justify-center gap-2 py-4" style={{ backgroundColor: dotsBg }}>
        {slideList.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}

const fallbackBannerUrl =
  typeof fallbackBanner === 'string' ? fallbackBanner : fallbackBanner?.src || '';

export const HOME_BANNER_SLIDER_DEFAULT_PROPS = {
  sectionId: 'hero',
  heroBg: '#1BB5B5',
  dotBarBg: '#22acb6',
  arrowBg: 'rgba(255,255,255,0.8)',
  arrowIconColor: '#1BB5B5',
  transitionMs: 700,
  slides: [
    {
      imageId: 0,
      imageUrl: fallbackBannerUrl,
      alt: 'Welcome — Ports Sacco',
      embedHtml: '',
    },
  ],
};
