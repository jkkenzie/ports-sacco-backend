import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { wpApiUrl, customApiUrl } from '../api/wp';
import { BlockRenderer } from '../blocks/BlockRenderer';

const SERVICES_ERROR_MESSAGE = 'Failed to load services. Please try again later.';

function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

export function ServicePostPage() {
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

    const customUrl = customApiUrl(`/services/${encodeURIComponent(currentSlug)}`);
    const fallbackUrl = wpApiUrl(`/wp-json/wp/v2/services?slug=${encodeURIComponent(currentSlug)}&_embed&per_page=1`);

    Promise.allSettled([
      fetch(customUrl, { headers: { Accept: 'application/json' } }),
      fetch(fallbackUrl, { headers: { Accept: 'application/json' } }),
    ])
      .then(async (results) => {
        if (cancelled) return;

        const [customRes, fallbackRes] = results;

        if (customRes.status === 'fulfilled' && customRes.value.ok) {
          const data = await customRes.value.json();
          setPost(data || null);
          setStatus({ loading: false, error: null, notFound: false });
          return;
        }

        if (fallbackRes.status === 'fulfilled' && fallbackRes.value.ok) {
          const arr = await fallbackRes.value.json();
          const wpPost = Array.isArray(arr) ? arr[0] : null;
          if (!wpPost) {
            setPost(null);
            setStatus({ loading: false, error: null, notFound: true });
            return;
          }

          const thumb = wpPost?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          setPost({
            id: wpPost.id,
            slug: wpPost.slug,
            title: stripHtml(String(wpPost?.title?.rendered || '')),
            imageUrl: thumb,
            blocks: [],
          });
          setStatus({ loading: false, error: null, notFound: false });
          return;
        }

        console.error('[ServicePostPage] Both endpoints failed', {
          slug: currentSlug,
          custom: customRes.status === 'fulfilled'
            ? { ok: customRes.value.ok, status: customRes.value.status }
            : { error: String(customRes.reason || '') },
          fallback: fallbackRes.status === 'fulfilled'
            ? { ok: fallbackRes.value.ok, status: fallbackRes.value.status }
            : { error: String(fallbackRes.reason || '') },
        });
        setPost(null);
        setStatus({ loading: false, error: SERVICES_ERROR_MESSAGE, notFound: false });
      })
      .catch((e) => {
        if (cancelled) return;
        console.error('[ServicePostPage] Load errored', e);
        setPost(null);
        setStatus({ loading: false, error: SERVICES_ERROR_MESSAGE, notFound: false });
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
        <h1 className="text-2xl font-semibold text-[#1f0026] mb-2">Service not found</h1>
      </div>
    );
  }

  if (status.error) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 text-sm">{status.error}</div>;
  }

  const blocks = Array.isArray(post?.blocks) ? post.blocks : [];

  const heroCandidates = ['custom/loan-archive-hero', 'custom/savings-archive-hero'];
  const heroIndex = Array.isArray(blocks) ? blocks.findIndex((block) => heroCandidates.includes(block?.name)) : -1;
  const hasHero = heroIndex >= 0;
  const heroBlock = hasHero ? [blocks[heroIndex]] : [];
  const otherBlocks = hasHero ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <div style={{ backgroundColor: '#f3f5f7' }}>
      {hasHero ? <BlockRenderer blocks={heroBlock} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-0 mt-[40px] mb-16 ">
          {otherBlocks.length > 0 ? (
            <section className="w-full bg-white pt-8">
              <BlockRenderer blocks={otherBlocks} />
            </section>
          ) : blocks.length === 0 ? (
            <div className="w-full bg-white py-8 px-3 rounded-2xl text-neutral-500 text-sm">
              No blocks on this service yet. Add Gutenberg blocks to its content.
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
