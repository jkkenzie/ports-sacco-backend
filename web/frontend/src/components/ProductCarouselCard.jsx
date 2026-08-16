import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const PRODUCT_CAROUSEL_SLIDE_CLASS =
  'min-w-0 flex flex-col self-stretch flex-[0_0_100%] sm:flex-[0_0_calc((100%-2.5rem)/2)] lg:flex-[0_0_calc((100%-5rem)/3)] sm:mr-10';

export const PRODUCT_CAROUSEL_VIEWPORT_CLASS =
  'mx-[-6px] overflow-hidden px-4 sm:px-6 lg:px-8';

export const PRODUCT_CAROUSEL_TRACK_CLASS = 'flex items-stretch gap-8 sm:gap-0 sm:-mr-10';

export const PRODUCT_CAROUSEL_STAGE_CLASS = 'relative px-2 lg:px-6';

const CARD_BASE_CLASS =
  'relative flex h-full min-h-0 w-full flex-col rounded-3xl border-[2px] border-[#e8e8e8] bg-white p-2 my-6';
const CARD_CLICKABLE_CLASS =
  'group cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#cfeeed] hover:shadow-[0_16px_30px_rgba(34,172,182,0.18)]';
const CARD_STATIC_CLASS = 'cursor-default';

export function ProductCarouselCardSkeleton() {
  return (
    <div className={PRODUCT_CAROUSEL_SLIDE_CLASS}>
      <div className={`${CARD_BASE_CLASS} animate-pulse`}>
        <div className="relative w-full shrink-0">
          <div className="relative h-[220px] w-full rounded-t-3xl bg-[#dfe5ea]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-6 pt-6 pb-4">
          <div className="mb-3 h-7 w-3/4 shrink-0 rounded bg-[#dfe5ea]" />
          <div className="mb-3 h-px w-full shrink-0 bg-gray-300" />
          <div className="mb-2 h-4 w-full shrink-0 rounded bg-[#e7ebef]" />
          <div className="mb-2 h-4 w-5/6 shrink-0 rounded bg-[#e7ebef]" />
          <div className="mt-auto h-4 w-2/3 shrink-0 rounded bg-[#e7ebef]" />
        </div>
      </div>
    </div>
  );
}

export function ProductCarouselCard({
  href = '',
  hasDetailPage = false,
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  titleColor = '#22ACB6',
  textColor = '#3b4e6b',
  arrowBgColor = '#82cdcb',
}) {
  const clickable = hasDetailPage === true;
  const to = clickable ? String(href || '').trim() : '';
  const isInternal = to.startsWith('/');
  const className = `${CARD_BASE_CLASS} ${clickable ? CARD_CLICKABLE_CLASS : CARD_STATIC_CLASS}`;
  const style = { animation: 'slideInCard 0.6s ease-out' };

  const cardInner = (
    <>
      <div className="relative w-full shrink-0">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={imageAlt || title || 'Product'}
            className={`block h-auto w-full rounded-t-3xl -mt-5 sm:-mt-10 ${
              clickable
                ? 'transition-transform duration-700 ease-out group-hover:scale-[1.14] group-hover:-translate-y-1'
                : ''
            }`}
            style={{ transform: 'scale(1.1)' }}
          />
        ) : (
          <div className="h-[220px] w-full rounded-t-3xl bg-[#dfe5ea]" />
        )}
        <span
          className={`pointer-events-none absolute bottom-0 right-0 z-10 flex items-center justify-center rounded-full text-white md:bottom-2 md:right-2 ${
            clickable ? 'transition-colors group-hover:bg-[#ee6e2a]' : 'opacity-70'
          }`}
          style={{ width: '30px', height: '30px', backgroundColor: arrowBgColor }}
          aria-hidden
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
      <div className="p-6 pt-6 pb-[0px]">
        <h3
          className={`mb-3 text-2xl font-black ${clickable ? 'transition-colors duration-300 group-hover:text-[#ee6e2a]' : ''}`}
          style={{
            fontFamily: 'Museo, sans-serif',
            fontWeight: 900,
            fontSize: '23px',
            color: titleColor,
          }}
        >
          {title}
        </h3>
        <div className="mb-3 h-px w-full bg-gray-300" />
        <p className="mb-4 text-sm" style={{ color: textColor }}>
          {description}
        </p>
      </div>
    </>
  );

  if (clickable && isInternal) {
    return (
      <Link to={to} className={className} style={style}>
        {cardInner}
      </Link>
    );
  }

  if (clickable && to) {
    return (
      <a href={to} className={className} style={style}>
        {cardInner}
      </a>
    );
  }

  return (
    <div className={className} style={style} aria-disabled="true">
      {cardInner}
    </div>
  );
}

export function ProductCarouselNavButton({ direction, onClick, ariaLabel, arrowColor = '#82cdcb' }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:bg-white hover:shadow-lg lg:flex ${
        isPrev ? '-left-10' : '-right-10'
      }`}
      aria-label={ariaLabel}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 10.31 16.11"
        fill="none"
        style={isPrev ? undefined : { transform: 'scaleX(-1)' }}
      >
        <path
          d="M6.51.66L.65,6.51C.24,6.93,0,7.5,0,8.08s.24,1.16.65,1.58l5.8,5.8c.87.87,2.28.87,3.15,0,.87-.87.87-2.28,0-3.16l-4.22-4.22,4.28-4.27c.87-.87.87-2.28,0-3.16C9.23.22,8.65,0,8.08,0s-1.14.22-1.58.66"
          fill={arrowColor}
        />
      </svg>
    </button>
  );
}
