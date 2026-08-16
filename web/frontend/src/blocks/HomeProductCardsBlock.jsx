import React, { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SectionTopCurveBar } from '../components/SectionTopCurveBar';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCards(cards) {
  const list = Array.isArray(cards) ? cards : [];
  return list
    .map((c) => ({
      imageUrl: String(c?.imageUrl || '').trim(),
      imageBgFrom: String(c?.imageBgFrom || '').trim(),
      imageBgTo: String(c?.imageBgTo || '').trim(),
      title: String(c?.title || '').trim(),
      description: String(c?.description || '').trim(),
      tag: String(c?.tag || '').trim(),
      href: String(c?.href || '#').trim() || '#',
    }))
    .filter((c) => c.title || c.description || c.imageUrl);
}

export function HomeProductCardsBlock({
  sectionId = 'products',
  anchor,
  sectionBgColor = '#F5F4EE',
  topCurveBgColor = '#ffffff',
  topCurveCutoutColor = '#F5F4EE',
  badgeText = 'EXPLORE',
  badgeBgColor = '#EE6E2A',
  badgeTextColor = '#ffffff',
  kickerText = 'EXPLORE OUR WIDE RANGE OF PRODUCTS AND SERVICES.',
  kickerColor = '#22ACB6',
  cardTagBarColor = '#F06E2A',
  cardTagTextColor = '#3b4e6b',
  cardTitleColor = '#22ACB6',
  cardTextColor = '#3b4e6b',
  arrowBgColor = '#ffffff',
  arrowHoverBgColor = '#EE6E2A',
  arrowColor = '#3b4e6b',
  arrowHoverColor = '#ffffff',
  imageBgFrom = '#00B2E0',
  imageBgTo = '#00AB81',
  cards = [],
}) {
  const reactId = useId().replace(/:/g, '');
  const clipTopId = `clip-products-svg-${reactId}`;
  const clipScrollId = `clip0_scroll_button_products_${reactId}`;
  const cardClipId = `card-clip-products-${reactId}`;

  const normalized = normalizeCards(cards);

  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(sectionId);
  const id = explicitAnchor || derived || 'products';

  return (
    <div
      id={id}
      className="relative pt-0 pb-10 overflow-visible"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: sectionBgColor }}
    >
      <style>
        {`
          #${id} .product-card-arrow {
            background-color: ${arrowBgColor};
            color: ${arrowColor};
          }
          #${id} .group:hover .product-card-arrow {
            background-color: ${arrowHoverBgColor};
            color: ${arrowHoverColor};
          }
        `}
      </style>

      <SectionTopCurveBar
        clipId={clipTopId}
        barBg={topCurveBgColor}
        accentColor={topCurveCutoutColor}
        pathFill={topCurveBgColor}
      />

      <div className="flex justify-center -mt-7 mb-0">
        <button
          type="button"
          onClick={scrollToNearestSection}
          className="hover:opacity-80 transition-opacity relative p-4 z-10 cursor-pointer"
          style={{ animation: 'float 3s ease-in-out infinite' }}
          aria-label="Scroll section to top"
        >
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath={`url(#${clipScrollId})`}>
              <path d={svgPaths.p1076300} fill="#ffffff" />
              <path d={svgPaths.p27278800} fill="transparent" />
            </g>
            <defs>
              <clipPath id={clipScrollId}>
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <svg className="absolute" width="0" height="0" viewBox="0 0 293 185" aria-hidden>
        <defs>
          <clipPath id={cardClipId} clipPathUnits="objectBoundingBox" transform="scale(0.00341297, 0.00540541)">
            <path d="M 0,0 L 293,0 L 293,111 C 294,118 288,133 275,133 C 268,134 264,133 258,139 C 252,145 252,149 251,157 C 251,164 245,169 242,170 L 15,170 Q 0,170 0,155 L 0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="text-center mb-4">
          <p className="text-sm mb-4" style={{ color: kickerColor }}>
            {kickerText}
          </p>
          <button
            type="button"
            className="px-8 py-2 rounded-full text-sm"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {badgeText}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 justify-items-center">
          {normalized.map((card, idx) => {
            const from = card.imageBgFrom || imageBgFrom;
            const to = card.imageBgTo || imageBgTo;
            const isFirst = idx === 0;

            return (
              <a
                key={`${card.title}-${idx}`}
                href={card.href || '#'}
                className="group block relative w-full max-w-[350px] cursor-pointer"
                style={{
                  filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))',
                  animation: 'slideInCard 0.6s ease-out',
                }}
              >
                <div className="relative overflow-visible rounded-t-3xl">
                  <div
                    className="relative overflow-visible rounded-t-3xl"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})` }}
                  >
                    {card.imageUrl ? (
                      <ImageWithFallback
                        src={card.imageUrl}
                        alt={card.title}
                        className={
                          isFirst
                            ? 'relative h-auto w-auto overflow-visible mx-auto z-[5]'
                            : 'h-full w-auto overflow-visible mx-auto'
                        }
                        style={{ transform: 'scale(1.3)' }}
                      />
                    ) : (
                      <div className="h-[220px] w-full rounded-t-3xl" />
                    )}
                  </div>

                  <div
                    className={
                      isFirst
                        ? 'content relative overflow-visible z-0 -top-6'
                        : 'content relative -mt-7 overflow-visible'
                    }
                  >
                    <div
                      className="relative p-6 bg-white w-full"
                      style={{
                        clipPath: `url(#${cardClipId})`,
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px',
                      }}
                    >
                      <div className="flex items-start gap-2 mb-2 pt-5">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: cardTagBarColor }} />
                        <p className="text-xs" style={{ color: cardTagTextColor }}>
                          {card.tag}
                        </p>
                      </div>
                      <h3
                        className="text-2xl mb-3"
                        style={{
                          fontFamily: 'Museo, sans-serif',
                          fontWeight: 900,
                          color: cardTitleColor,
                        }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: cardTextColor }}>
                        {card.description}
                      </p>
                    </div>

                    <span
                      className="product-card-arrow absolute rounded-full transition-colors z-10 flex items-center justify-center pointer-events-none"
                      style={{
                        bottom: '12px',
                        right: '4px',
                        width: '35px',
                        height: '35px',
                      }}
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
