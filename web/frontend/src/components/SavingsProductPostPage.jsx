import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customApiUrl } from '../api/wp';
import { BlockRenderer } from '../blocks/BlockRenderer';

const SAVINGS_PRODUCTS_ERROR_MESSAGE = 'Failed to load savings products. Please try again later.';

export function SavingsProductPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null, notFound: false });

  useEffect(() => {
    let cancelled = false;
    const currentSlug = (slug || '').trim().toLowerCase();

    if (!currentSlug) {
      setPost(null);
      setStatus({ loading: false, error: null, notFound: true });
      return () => {
        cancelled = true;
      };
    }

    setStatus({ loading: true, error: null, notFound: false });
    fetch(customApiUrl(`/savings-products/${encodeURIComponent(currentSlug)}`), {
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setPost(null);
          setStatus({ loading: false, error: null, notFound: true });
          return;
        }
        if (!res.ok) {
          setPost(null);
          setStatus({ loading: false, error: SAVINGS_PRODUCTS_ERROR_MESSAGE, notFound: false });
          return;
        }
        const data = await res.json();
        setPost(data || null);
        setStatus({ loading: false, error: null, notFound: false });
      })
      .catch((e) => {
        if (cancelled) return;
        setPost(null);
        setStatus({ loading: false, error: e?.message || SAVINGS_PRODUCTS_ERROR_MESSAGE, notFound: false });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status.loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-[#65605f]">Loading...</div>;
  }

  if (status.notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#1f0026] mb-2">Savings product not found</h1>
      </div>
    );
  }

  if (status.error) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 text-sm">{status.error}</div>;
  }

  const blocks = Array.isArray(post?.blocks) ? post.blocks : [];

  const heroCandidates = ['custom/savings-archive-hero'];
  const heroIndex = Array.isArray(blocks) ? blocks.findIndex((block) => heroCandidates.includes(block?.name)) : -1;
  const hasHero = heroIndex >= 0;
  const heroBlock = hasHero ? [blocks[heroIndex]] : [];
  const otherBlocks = hasHero ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <div style={{ backgroundColor: '#f3f5f7' }}>
      {hasHero ? <BlockRenderer blocks={heroBlock} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="elative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-0 mt-[40px] mb-16 ">
          {otherBlocks.length > 0 ? (
            <section className="w-full bg-white pt-8">
              <BlockRenderer blocks={otherBlocks} />
            </section>
          ) : blocks.length === 0 ? (
            <div className="w-full bg-white py-8 px-3 rounded-2xl text-neutral-500 text-sm">
              No blocks on this savings product yet. Add Gutenberg blocks to its content.
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
