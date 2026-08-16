import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPageBySlug } from '../api/wp';
import { BlockRenderer } from '../blocks/BlockRenderer';

const LOAN_PRODUCTS_PAGE_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

export function LoanProductsPage() {
  const location = useLocation();
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null, notFound: false });

  useEffect(() => {
    let cancelled = false;

    setStatus({ loading: true, error: null, notFound: false });
    fetchPageBySlug('loan-products')
      .then((result) => {
        if (cancelled) return;
        if (result.status === 404) {
          setBlocks([]);
          setStatus({ loading: false, error: null, notFound: true });

          return;
        }
        if (!result.ok) {
          console.error('[LoanProductsPage] Page fetch failed', {
            status: result.status,
            slug: 'loan-products',
          });
          setBlocks([]);
          setStatus({ loading: false, error: LOAN_PRODUCTS_PAGE_ERROR_MESSAGE, notFound: false });

          return;
        }
        if (result.data && Array.isArray(result.data.blocks)) {
          setBlocks(result.data.blocks);
        } else {
          setBlocks([]);
        }
        setStatus({ loading: false, error: null, notFound: false });
      })
      .catch((e) => {
        if (cancelled) return;
        console.error('[LoanProductsPage] Page fetch errored', e);
        setBlocks([]);
        setStatus({ loading: false, error: LOAN_PRODUCTS_PAGE_ERROR_MESSAGE, notFound: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = id ? document.getElementById(id) || document.querySelector(location.hash) : null;
      if (el) {
        setTimeout(() => {
          const headerOffset = 100;
          const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  if (status.loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-[#65605f]" style={{ fontFamily: 'Gotham Rounded, sans-serif' }}>
        Loading…
      </div>
    );
  }

  if (status.notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#1f0026] mb-2">Page not found</h1>
        <p className="text-[#65605f]">Publish the WordPress page and add Gutenberg blocks.</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 text-sm">
        {status.error}
      </div>
    );
  }

  const heroCandidates = ['custom/loan-archive-hero', 'custom/savings-archive-hero'];
  const heroIndex = Array.isArray(blocks)
    ? blocks.findIndex((block) => heroCandidates.includes(block?.name))
    : -1;
  const hasHero = heroIndex >= 0;
  const heroBlock = hasHero ? [blocks[heroIndex]] : [];
  const otherBlocks = hasHero ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <>
      {hasHero ? <BlockRenderer blocks={heroBlock} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
          {otherBlocks.length > 0 ? <BlockRenderer blocks={otherBlocks} /> : null}
          {otherBlocks.length === 0 ? (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 text-sm">
              No blocks on this page yet. Add blocks in WordPress (Gutenberg) to populate this route.
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
}
