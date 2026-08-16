import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroContent } from './PageHeroContent';

const NAV_BORDER = '#c8cee3';
const TEAL = '#22ABB5';

export function ServicesHeroSection({ hero, loading }) {
  if (loading) {
    return (
      <section
        className="relative w-full min-h-[400px] flex items-center justify-center"
        style={{ backgroundColor: TEAL }}
      >
        <div className="text-white text-lg">Loading…</div>
      </section>
    );
  }

  if (!hero) {
    return (
      <section
        className="relative w-full min-h-[300px] flex items-center justify-center"
        style={{ backgroundColor: TEAL }}
      >
        <h1 className="text-white text-2xl font-bold uppercase">Services</h1>
      </section>
    );
  }

  const menuItems = hero.menu_items ?? [];
  const buttons = hero.buttons ?? [];
  const heading = hero.heading ?? 'Services';
  const bannerUrl = hero.banner_url ?? '';

  return (
    <PageHeroContent
      bannerImageUrl={bannerUrl}
      bannerImagePositionX="center"
      bannerImagePositionY="bottom"
      backgroundColor={TEAL}
    >
          <div className="flex flex-col lg:flex-row px-7 lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1
                className="uppercase tracking-tight"
                style={{
                  color: TEAL,
                  fontFamily: 'Museo900-Regular, Museo, sans-serif',
                  fontSize: '28px',
                  fontWeight: 800,
                }}
              >
                {heading}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {buttons.map((btn, i) => {
                const isOrange = i === 1;
                const className = isOrange
                  ? 'inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors bg-transparent text-[#ed6e2a] border-[#ed6e2a] hover:bg-[#ed6e2a] hover:text-white'
                  : 'inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors text-[#22abb5] border-[#22abb5] hover:bg-[#22abb5] hover:text-white';
                return btn.href && btn.href.startsWith('/') ? (
                  <Link key={i} to={btn.href} className={className}>
                    {btn.label}
                  </Link>
                ) : (
                  <a key={i} href={btn.href || '#'} className={className}>
                    {btn.label}
                  </a>
                );
              })}
            </div>
          </div>

          {menuItems.length > 0 && (
            <nav
              className="mt-6 -mx-4 sm:-mx-6 pt-0"
              style={{
                borderTop: `2px solid ${NAV_BORDER}`,
                backgroundColor: '#eef2f8',
              }}
              aria-label="Services actions"
            >
              <ul className="flex flex-wrap md:flex-nowrap items-stretch uppercase tracking-wide px-4 sm:px-6">
                {menuItems.map((item, index) => (
                  <li
                    key={item.id || index}
                    className={`flex w-full md:flex-1 md:min-w-0 items-center justify-center border-b-2 md:border-b-0 ${index === 0 ? 'md:border-l-0' : 'md:border-l-2'}`}
                    style={{ borderColor: NAV_BORDER }}
                  >
                    {item.href && item.href.startsWith('/') ? (
                      <Link
                        to={item.href}
                        className="py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center text-[14px] transition-colors hover:text-[#ED6E2A] hover:font-bold whitespace-normal break-words text-[#65605f]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href || '#'}
                        className="py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center text-[14px] transition-colors hover:text-[#ED6E2A] hover:font-bold whitespace-normal break-words text-[#65605f]"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
    </PageHeroContent>
  );
}
