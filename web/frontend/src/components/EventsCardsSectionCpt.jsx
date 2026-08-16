import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchEventsList } from '../api/events';

const EVENTS_ERROR_MESSAGE = 'Failed to load events. Please try again later.';

export function EventsCardsSectionCpt({ categoryId = 0 }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const data = await fetchEventsList({
          categoryId: Number(categoryId) || 0,
          limit: 0,
        });
        if (!isCancelled) {
          setItems(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[EventsCardsSectionCpt] Load failed', err);
        if (!isCancelled) {
          setItems([]);
          setError(EVENTS_ERROR_MESSAGE);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [categoryId]);

  return (
    <section className="w-full py-6 px-6 lg:py-6">
      <div className="mx-auto" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {!isLoading && error ? <p className="text-[#ee6e2a] text-base px-4">{error}</p> : null}
        {!isLoading && !error && items.length === 0 ? (
          <p className="text-[#3b4e6b] text-base px-4">No events available right now.</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`event-skeleton-${index}`}
                  className="relative w-full max-w-[350px] bg-white rounded-3xl p-2 my-6 border-[#e8e8e8] border-[2px] animate-pulse"
                >
                  <div className="relative w-full h-[220px] rounded-t-3xl bg-[#dfe5ea]" />
                  <div className="p-6 pt-6 pb-[0px]">
                    <div className="h-7 w-3/4 rounded bg-[#dfe5ea] mb-3" />
                    <div className="w-full h-px bg-gray-300 mb-3" />
                    <div className="h-4 w-full rounded bg-[#e7ebef] mb-2" />
                    <div className="h-4 w-5/6 rounded bg-[#e7ebef] mb-2" />
                    <div className="h-4 w-2/3 rounded bg-[#e7ebef] mb-4" />
                  </div>
                </div>
              ))
            : null}

          {items.map((item) => {
            const itemTitle = item.title || '';
            const itemDescription = item.description || '';
            const itemImage = item.imageUrl || '';
            const itemHref = item.link || '#';
            const CardWrapper = itemHref.startsWith('/') ? Link : 'a';
            const wrapperProps = itemHref.startsWith('/') ? { to: itemHref } : { href: itemHref };

            return (
              <CardWrapper
                {...wrapperProps}
                key={item.id || item.slug || itemTitle}
                className="group block relative w-full max-w-[350px] bg-white rounded-3xl p-2 cursor-pointer transition-all duration-500 ease-out my-6 border-[#e8e8e8] border-[2px] hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(34,172,182,0.18)] hover:border-[#cfeeed]"
                style={{ animation: 'slideInCard 0.6s ease-out' }}
              >
                <div className="relative w-full">
                  {itemImage ? (
                    <ImageWithFallback
                      src={itemImage}
                      alt={itemTitle}
                      className="w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10 transition-transform duration-700 ease-out group-hover:scale-[1.14] group-hover:-translate-y-1"
                      style={{ transform: 'scale(1.1)' }}
                    />
                  ) : (
                    <div className="w-full h-[220px] rounded-t-3xl bg-[#dfe5ea]" />
                  )}
                  <span
                    className="absolute bg-[#82cdcb] text-white rounded-full group-hover:bg-[#ee6e2a] transition-colors z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0 pointer-events-none"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <div className="p-6 pt-6 pb-[0px]">
                  <h3
                    className="text-2xl text-[#22ACB6] mb-3 font-black transition-colors duration-300 group-hover:text-[#ee6e2a]"
                    style={{ fontFamily: 'Museo, Helvetica, sans-serif', fontWeight: 900, fontSize: '23px' }}
                  >
                    {itemTitle}
                  </h3>
                  <div className="w-full h-px bg-gray-300 mb-3" />
                  <p className="text-[#3b4e6b] text-sm mb-4">{itemDescription}</p>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
