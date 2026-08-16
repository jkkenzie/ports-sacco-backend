import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPageBySlug } from '../api/wp';
import { BlockRenderer } from '../blocks/BlockRenderer';

export function SavingsProductsPage() {
  const location = useLocation();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPageBySlug('savings-products')
      .then((result) => {
        if (cancelled) return;
        if (result.ok && result.data && Array.isArray(result.data.blocks)) {
          setBlocks(result.data.blocks);
        } else {
          setBlocks([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBlocks([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
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

  if (isLoading) {
    return null;
  }

  const heroIndex = blocks.findIndex((block) => block?.name === 'custom/savings-archive-hero');
  const hasHero = heroIndex >= 0;
  const heroBlock = hasHero ? [blocks[heroIndex]] : [];
  const otherBlocks = hasHero ? blocks.filter((_, index) => index !== heroIndex) : blocks;

  return (
    <>
      {hasHero ? <BlockRenderer blocks={heroBlock} /> : null}
      {otherBlocks.length > 0 ? (
        <div style={{ backgroundColor: '#f3f5f7' }}>
          <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full pb-0 pt-[25px] mt-[20px] mb-16">
            <BlockRenderer blocks={otherBlocks} />
          </main>
        </div>
      ) : null}
    </>
  );
}
