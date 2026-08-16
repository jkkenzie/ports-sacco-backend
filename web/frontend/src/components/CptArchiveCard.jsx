import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

const CARD_BASE_CLASS =
  'relative w-full max-w-[350px] bg-white rounded-3xl p-2 my-6 border-[#e8e8e8] border-[2px]';
const CARD_CLICKABLE_CLASS =
  'group block cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(34,172,182,0.18)] hover:border-[#cfeeed]';
const CARD_STATIC_CLASS = 'cursor-default';

export function CptArchiveCard({ item }) {
  const itemTitle = item?.title || '';
  const itemDescription = item?.description || '';
  const itemImage = item?.imageUrl || '';
  const clickable = item?.hasDetailPage === true;
  const itemHref = clickable ? item?.link || '' : '';
  const cardClassName = `${CARD_BASE_CLASS} ${clickable ? CARD_CLICKABLE_CLASS : CARD_STATIC_CLASS}`;

  const cardInner = (
    <>
      <div className="relative w-full">
        {itemImage ? (
          <ImageWithFallback
            src={itemImage}
            alt={itemTitle}
            className={`w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10 ${
              clickable
                ? 'transition-transform duration-700 ease-out group-hover:scale-[1.14] group-hover:-translate-y-1'
                : ''
            }`}
            style={{ transform: 'scale(1.1)' }}
          />
        ) : (
          <div className="w-full h-[220px] rounded-t-3xl bg-[#dfe5ea]" />
        )}
        <span
          className={`absolute bg-[#82cdcb] text-white rounded-full z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0 pointer-events-none ${
            clickable ? 'group-hover:bg-[#ee6e2a] transition-colors' : 'opacity-70'
          }`}
          style={{ width: '30px', height: '30px' }}
          aria-hidden
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
      <div className="p-6 pt-6 pb-[0px]">
        <h3
          className={`text-2xl text-[#22ACB6] mb-3 font-black ${
            clickable ? 'transition-colors duration-300 group-hover:text-[#ee6e2a]' : ''
          }`}
          style={{ fontFamily: 'Museo, Helvetica, sans-serif', fontWeight: 900, fontSize: '23px' }}
        >
          {itemTitle}
        </h3>
        <div className="w-full h-px bg-gray-300 mb-3" />
        <p className="text-[#3b4e6b] text-sm mb-4">{itemDescription}</p>
      </div>
    </>
  );

  if (clickable && itemHref.startsWith('/')) {
    return (
      <Link
        to={itemHref}
        className={cardClassName}
        style={{ animation: 'slideInCard 0.6s ease-out' }}
      >
        {cardInner}
      </Link>
    );
  }

  if (clickable && itemHref) {
    return (
      <a
        href={itemHref}
        className={cardClassName}
        style={{ animation: 'slideInCard 0.6s ease-out' }}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <div
      className={cardClassName}
      style={{ animation: 'slideInCard 0.6s ease-out' }}
      aria-disabled="true"
    >
      {cardInner}
    </div>
  );
}
