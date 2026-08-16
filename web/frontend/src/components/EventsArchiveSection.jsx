import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchEventsList } from '../api/events';

const EVENTS_ERROR_MESSAGE = 'Failed to load events. Please try again later.';
const MUSEO = 'Museo900-Regular, Museo, sans-serif';

function EventArchiveCardSkeleton({ index }) {
  return (
    <div
      key={`event-skeleton-${index}`}
      className="relative w-full max-w-[380px] animate-pulse rounded-3xl border-2 border-[#e8e8e8] bg-white p-2"
    >
      <div className="relative h-[220px] w-full rounded-t-3xl bg-[#dfe5ea]" />
      <div className="p-6 pt-6">
        <div className="mb-3 h-4 w-1/3 rounded bg-[#e7ebef]" />
        <div className="mb-3 h-7 w-3/4 rounded bg-[#dfe5ea]" />
        <div className="mb-2 h-4 w-full rounded bg-[#e7ebef]" />
        <div className="h-4 w-5/6 rounded bg-[#e7ebef]" />
      </div>
    </div>
  );
}

export function EventsArchiveSection({
  title = '',
  intro = '',
  categoryId = 0,
  emptyMessage = 'No events available right now.',
}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setIsLoading(true);
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
        console.error('[EventsArchiveSection] Load failed', err);
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

  const showHeader = Boolean(String(title || '').trim() || String(intro || '').trim());

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {showHeader ? (
          <header className="mb-10 max-w-3xl">
            {title ? (
              <h2
                className="mb-3 text-3xl font-black tracking-tight text-[#1e293b] sm:text-4xl"
                style={{ fontFamily: MUSEO }}
              >
                {title}
              </h2>
            ) : null}
            {intro ? (
              <p className="text-base leading-relaxed text-[#64748b] sm:text-lg">{intro}</p>
            ) : null}
            <div
              className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#22acb6] to-[#ee6e2a]"
              aria-hidden
            />
          </header>
        ) : null}

        {!isLoading && error ? <p className="mb-6 text-base text-[#ee6e2a]">{error}</p> : null}
        {!isLoading && !error && items.length === 0 ? (
          <p className="mb-6 text-base text-[#3b4e6b]">{emptyMessage}</p>
        ) : null}

        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <EventArchiveCardSkeleton key={`event-skel-${index}`} index={index} />
              ))
            : null}

          {!isLoading &&
            items.map((item) => {
              const href = item.link || (item.slug ? `/events/${item.slug}` : '#');
              const categoryName = item.primaryCategory?.name || item.categories?.[0]?.name || '';
              const CardWrapper = href.startsWith('/') ? Link : 'a';
              const wrapperProps = href.startsWith('/') ? { to: href } : { href };

              return (
                <CardWrapper
                  {...wrapperProps}
                  key={item.id || item.slug}
                  className="group flex w-full max-w-[380px] flex-col overflow-hidden rounded-3xl border-2 border-[#e8e8e8] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#cfeeed] hover:shadow-[0_20px_40px_rgba(34,172,182,0.16)]"
                  style={{ animation: 'slideInCard 0.6s ease-out' }}
                >
                  <div className="relative block overflow-hidden">
                    {item.imageUrl ? (
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title || 'Event'}
                        className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-[220px] w-full bg-gradient-to-br from-[#40c9bf] via-[#22acb6] to-[#1a8a93]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/55 via-transparent to-transparent opacity-80" />
                    {categoryName ? (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#22acb6] shadow-sm">
                        {categoryName}
                      </span>
                    ) : null}
                    <span
                      className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-[#82cdcb] text-white transition-colors group-hover:bg-[#ee6e2a]"
                      aria-hidden
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 pt-5">
                    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b]">
                      {item.date ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-[#22acb6]" aria-hidden />
                          {item.date}
                        </span>
                      ) : null}
                      {item.author ? (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="size-3.5 text-[#22acb6]" aria-hidden />
                          {item.author}
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className="mb-3 text-xl font-black text-[#22acb6] transition-colors duration-300 group-hover:text-[#ee6e2a] sm:text-2xl"
                      style={{ fontFamily: MUSEO }}
                    >
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-[#3b4e6b]">{item.description}</p>
                    ) : null}
                  </div>
                </CardWrapper>
              );
            })}
        </div>
      </div>
    </section>
  );
}
