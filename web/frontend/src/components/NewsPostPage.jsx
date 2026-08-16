import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, MessageCircle, User } from 'lucide-react';
import { fetchNewsPost } from '../api/news';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { useSocialMeta } from '../hooks/useSocialMeta';
import { buildNewsPostShareUrl } from '../utils/shareUrl';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsPostComments } from './NewsPostComments';
import { NewsPostNavigation } from './NewsPostNavigation';
import { NewsPostShareBar } from './NewsPostShareBar';
import { splitPageHeroBlocks } from './StandardPageLayout';

const NEWS_POST_ERROR = 'Failed to load this article. Please try again later.';

export function NewsPostPage() {
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

    fetchNewsPost(currentSlug)
      .then((data) => {
        if (cancelled) return;
        setPost(data || null);
        setStatus({ loading: false, error: null, notFound: false });
      })
      .catch((e) => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('[NewsPostPage] Load failed', e);
        if (String(e?.message || '').toLowerCase().includes('not found')) {
          setPost(null);
          setStatus({ loading: false, error: null, notFound: true });
          return;
        }
        setPost(null);
        setStatus({ loading: false, error: NEWS_POST_ERROR, notFound: false });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const shareMeta = useMemo(() => {
    if (!post) return null;
    const share = post.share || {};
    return {
      title: share.title || post.title || '',
      description: share.description || post.excerpt || '',
      imageUrl: share.imageUrl || post.imageUrl || '',
      url: buildNewsPostShareUrl(post),
    };
  }, [post]);

  useSocialMeta({
    title: shareMeta?.title,
    description: shareMeta?.description,
    imageUrl: shareMeta?.imageUrl,
    url: shareMeta?.url,
    enabled: Boolean(post && shareMeta),
  });

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
        <h1 className="text-2xl font-semibold text-[#1f0026] mb-2">Article not found</h1>
        <Link to="/news" className="text-[#22acb6] underline text-sm mt-4 inline-block">
          Back to news
        </Link>
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

  const blocks = Array.isArray(post?.blocks) ? post.blocks : [];
  const { hasHero, heroBlocks, contentBlocks } = splitPageHeroBlocks(blocks);
  const heroFromBlocks = hasHero;
  const categories = Array.isArray(post?.categories) ? post.categories : [];
  const approvedComments = Array.isArray(post?.approvedComments) ? post.approvedComments : [];
  const commentCount = approvedComments.length || Number(post?.commentCount) || 0;
  const commentsOpen = post?.commentsOpen !== false;

  return (
    <>
      {heroFromBlocks ? <BlockRenderer blocks={heroBlocks} /> : null}

      <div style={{ backgroundColor: '#f3f5f7' }}>
        <main className="relative z-10 mx-auto w-full max-w-4xl pb-16 pt-8 px-4 sm:px-6">
          <article className="overflow-hidden rounded-3xl border-2 border-[#e8e8e8] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {!heroFromBlocks && post?.imageUrl ? (
              <div className="relative h-[280px] sm:h-[360px] overflow-hidden">
                <ImageWithFallback src={post.imageUrl} alt={post.title || ''} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 to-transparent" />
              </div>
            ) : null}

            <div className="p-6 sm:p-10">
              {categories.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id || cat.slug}
                      className="rounded-full bg-[#f0fafb] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#22acb6]"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <h1
                className="mb-4 text-3xl sm:text-4xl font-black text-[#1e293b] leading-tight"
                style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}
              >
                {post?.title}
              </h1>

              <div className="mb-8 flex flex-wrap gap-4 text-sm text-[#64748b] border-b border-[#e2e8f0] pb-6">
                {post?.author ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-4 text-[#22acb6]" aria-hidden />
                    {post.author}
                  </span>
                ) : null}
                {post?.date ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-[#22acb6]" aria-hidden />
                    {post.date}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-4 text-[#22acb6]" aria-hidden />
                  {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                </span>
              </div>

              {contentBlocks.length > 0 ? (
                <div className="prose-news max-w-none">
                  <BlockRenderer blocks={contentBlocks} />
                </div>
              ) : post?.excerpt ? (
                <p className="text-[#3b4e6b] leading-relaxed">{post.excerpt}</p>
              ) : (
                <p className="text-neutral-500 text-sm">No content for this article yet.</p>
              )}

              <NewsPostShareBar post={post} />
            </div>
          </article>

          <NewsPostComments
            slug={post?.slug || slug}
            commentsOpen={commentsOpen}
            initialComments={approvedComments}
          />

          <NewsPostNavigation navigation={post?.navigation} />
        </main>
      </div>
    </>
  );
}
