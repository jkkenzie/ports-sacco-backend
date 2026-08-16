import { useEffect, useState } from 'react';
import { fetchLoanProductsList } from '../api/loanProducts';
import { CptArchiveCard } from './CptArchiveCard';

const LOAN_PRODUCTS_ERROR_MESSAGE = 'Failed to load loan products. Please try again later.';

export function LoanProductsCardsSectionCpt({ categoryId = 0 }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const data = await fetchLoanProductsList({
          categoryId: Number(categoryId) || 0,
          limit: 0,
        });
        if (!isCancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[LoanProductsCardsSectionCpt] Load failed', err);
        if (!isCancelled) {
          setProducts([]);
          setError(LOAN_PRODUCTS_ERROR_MESSAGE);
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
        {!isLoading && !error && products.length === 0 ? (
          <p className="text-[#3b4e6b] text-base px-4">No loan products available right now.</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`loan-skeleton-${index}`}
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

          {products.map((item) => (
            <CptArchiveCard key={item.id || item.slug || item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
