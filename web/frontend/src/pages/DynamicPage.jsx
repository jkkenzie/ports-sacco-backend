import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPageBySlug } from '../api/wp';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { HeroSection } from '../components/HeroSection';
import { HomeStatsBlock, HOME_STATS_DEFAULT_PROPS } from '../blocks/HomeStatsBlock';
import { AboutSection } from '../components/AboutSection';
import { ProductCardsSection } from '../components/ProductCardsSection';
import { ProductServicesSection } from '../components/ProductServicesSection';
import { CarouselsSection } from '../components/CarouselsSection';
import { NewsEventsSection } from '../components/NewsEventsSection';
import { MemberReviewsSection } from '../components/MemberReviewsSection';
import { HelpSection } from '../components/HelpSection';
import { StandardPageLayout } from '../components/StandardPageLayout';

const LEGACY_REDIRECTS = {
  '/savings-products/asset-finance': '/loan-products/asset-finance',
};

function HomePageLegacy() {
  return (
    <>
      <HeroSection />
      <HomeStatsBlock {...HOME_STATS_DEFAULT_PROPS} />
      <AboutSection />
      <ProductCardsSection />
      <ProductServicesSection />
      <CarouselsSection />
      <NewsEventsSection />
      <MemberReviewsSection />
      <HelpSection />
    </>
  );
}

function routeSlugFromPathname(pathname) {
  if (!pathname || pathname === '/') {
    return 'home';
  }
  return pathname.replace(/^\//, '');
}

export function DynamicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null, notFound: false });

  useEffect(() => {
    const to = LEGACY_REDIRECTS[location.pathname];
    if (to) {
      navigate(to + (location.hash || ''), { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  useEffect(() => {
    if (LEGACY_REDIRECTS[location.pathname]) {
      return;
    }

    let cancelled = false;
    const slug = routeSlugFromPathname(location.pathname);

    setStatus((s) => ({ ...s, loading: true, error: null, notFound: false }));

    fetchPageBySlug(slug)
      .then((r) => {
        if (cancelled) return;
        if (r.status === 404) {
          setPage(null);
          setStatus({ loading: false, error: null, notFound: true });
          return;
        }
        if (!r.ok) {
          setPage(null);
          setStatus({ loading: false, error: `Page request failed (${r.status})`, notFound: false });
          return;
        }
        setPage(r.data);
        setStatus({ loading: false, error: null, notFound: false });
      })
      .catch((e) => {
        if (cancelled) return;
        setPage(null);
        setStatus({ loading: false, error: e?.message || 'Page request failed', notFound: false });
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

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
  }, [location.hash, location.pathname, page]);

  if (LEGACY_REDIRECTS[location.pathname]) {
    return null;
  }

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
        <p className="text-[#65605f]">This path is not a published WordPress page.</p>
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

  const slug = routeSlugFromPathname(location.pathname);
  const blocks = page?.blocks || [];

  if (slug === 'home' && blocks.length === 0) {
    return <HomePageLegacy />;
  }

  if (slug === 'home') {
    // Home is composed of full-width sections. Individual blocks handle their own boxing.
    return (
      <div style={{ backgroundColor: '#f3f5f7' }}>
        {blocks.length > 0 ? <BlockRenderer blocks={blocks} /> : null}
        {blocks.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 text-sm">
            No blocks on this page yet. Add blocks in WordPress (Gutenberg) to populate this route.
          </div>
        ) : null}
      </div>
    );
  }

  return <StandardPageLayout blocks={blocks} contentSectionId={`${slug}-content`} />;
}
