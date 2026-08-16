import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsArchiveCardSkeleton } from './NewsArchiveCardSkeleton';
import { fetchNewsArchive, fetchNewsCategories } from '../api/news';

const NEWS_ERROR_MESSAGE = 'Failed to load news. Please try again later.';

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((p) => {
    if (prev && p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  });
  return out;
}

export function NewsCardsSection({ perPage = 9, readMoreLabel = 'Read More' }) {
  const sectionRef = useRef(null);
  const [categories, setCategories] = useState([{ id: 0, name: 'All', slug: '', count: 0 }]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 9, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const postsPerPage = Math.min(24, Math.max(3, Number(perPage) || 9));

  useEffect(() => {
    let cancelled = false;
    fetchNewsCategories()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) {
          setCategories(data);
        }
      })
      .catch(() => {
        /* keep default All */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadArchive = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchNewsArchive({
        categoryId: activeCategory,
        page,
        perPage: postsPerPage,
      });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setPagination(data?.pagination || { page, perPage: postsPerPage, total: 0, totalPages: 1 });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[NewsCardsSection] Load failed', err);
      setItems([]);
      setError(NEWS_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, page, postsPerPage]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  const handleCategoryChange = (categoryId) => {
    const next = Number(categoryId) || 0;
    if (next === activeCategory) return;
    setActiveCategory(next);
    setPage(1);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageChange = (nextPage) => {
    const p = Math.max(1, Math.min(pagination.totalPages || 1, nextPage));
    if (p === page) return;
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pageNumbers = useMemo(
    () => buildPageNumbers(page, pagination.totalPages || 1),
    [page, pagination.totalPages]
  );

  return (
    <section ref={sectionRef} className="w-full py-8 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '100px' }}>
      <div className="mx-auto max-w-7xl" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        {/* Category filter */}
        <div className="mb-10">
          <p
            className="text-xs font-bold tracking-[0.2em] text-[#22acb6] mb-3 uppercase"
            style={{ fontFamily: 'Gotham Rounded, sans-serif' }}
          >
            Browse by topic
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const id = Number(cat.id) || 0;
              const active = id === activeCategory;
              return (
                <button
                  key={`news-cat-${id}-${cat.slug || 'all'}`}
                  type="button"
                  disabled={isLoading && active}
                  onClick={() => handleCategoryChange(id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
                    'border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22acb6]/40',
                    active
                      ? 'bg-[#22acb6] border-[#22acb6] text-white shadow-[0_8px_20px_rgba(34,172,182,0.25)]'
                      : 'bg-white border-[#e2e8f0] text-[#3b4e6b] hover:border-[#22acb6] hover:text-[#22acb6]',
                    isLoading ? 'opacity-90' : '',
                  ].join(' ')}
                >
                  <span>{cat.name}</span>
                  {typeof cat.count === 'number' && cat.count > 0 ? (
                    <span
                      className={[
                        'text-[11px] font-bold rounded-full px-2 py-0.5 min-w-[1.5rem] text-center',
                        active ? 'bg-white/20 text-white' : 'bg-[#f0fafb] text-[#22acb6]',
                      ].join(' ')}
                    >
                      {cat.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {!isLoading && error ? <p className="text-[#ee6e2a] text-base mb-6">{error}</p> : null}
        {!isLoading && !error && items.length === 0 ? (
          <p className="text-[#3b4e6b] text-base mb-6">No news articles found in this category.</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {isLoading
            ? Array.from({ length: postsPerPage > 6 ? 6 : postsPerPage }).map((_, index) => (
                <NewsArchiveCardSkeleton key={`news-skel-${index}`} index={index} />
              ))
            : null}

          {!isLoading &&
            items.map((item) => {
              const href = item.link || (item.slug ? `/news/${item.slug}` : '#');
              const categoryName = item.primaryCategory?.name || item.categories?.[0]?.name || '';
              const commentCount = Number(item.commentCount) || 0;

              return (
                <article
                  key={item.id || item.slug}
                  className="group flex w-full max-w-[380px] flex-col overflow-hidden rounded-3xl border-2 border-[#e8e8e8] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#cfeeed] hover:shadow-[0_20px_40px_rgba(34,172,182,0.16)]"
                  style={{ animation: 'slideInCard 0.6s ease-out' }}
                >
                  <Link to={href} className="relative block overflow-hidden">
                    {item.imageUrl ? (
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title || 'News'}
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
                  </Link>

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
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="size-3.5 text-[#22acb6]" aria-hidden />
                        {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                      </span>
                    </div>

                    <Link to={href} className="block">
                      <h3
                        className="mb-3 text-xl font-black leading-snug text-[#1e293b] transition-colors duration-300 group-hover:text-[#22acb6] line-clamp-2"
                        style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}
                      >
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mb-4 h-px w-full bg-gradient-to-r from-[#22acb6]/30 via-[#e2e8f0] to-transparent" />

                    <p className="mb-6 flex-1 text-sm leading-relaxed text-[#3b4e6b] line-clamp-3">
                      {item.excerpt || item.description}
                    </p>

                    <Link
                      to={href}
                      className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#22acb6] bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#22acb6] transition-all duration-300 hover:bg-[#22acb6] hover:text-white hover:shadow-[0_10px_24px_rgba(34,172,182,0.28)]"
                    >
                      {readMoreLabel}
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        {!isLoading && !error && (pagination.totalPages || 1) > 1 ? (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
            aria-label="News pagination"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="rounded-full border-2 border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#3b4e6b] transition hover:border-[#22acb6] hover:text-[#22acb6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            {pageNumbers.map((num, idx) =>
              num === '…' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-[#94a3b8]">
                  …
                </span>
              ) : (
                <button
                  key={`page-${num}`}
                  type="button"
                  onClick={() => handlePageChange(num)}
                  aria-current={num === page ? 'page' : undefined}
                  className={[
                    'min-w-[2.5rem] rounded-full px-3 py-2 text-sm font-bold transition-all duration-300',
                    num === page
                      ? 'bg-[#22acb6] text-white shadow-[0_8px_20px_rgba(34,172,182,0.3)]'
                      : 'border-2 border-[#e2e8f0] bg-white text-[#3b4e6b] hover:border-[#22acb6] hover:text-[#22acb6]',
                  ].join(' ')}
                >
                  {num}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => handlePageChange(page + 1)}
              className="rounded-full border-2 border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#3b4e6b] transition hover:border-[#22acb6] hover:text-[#22acb6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
