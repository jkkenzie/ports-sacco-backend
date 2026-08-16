import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeroContent } from './PageHeroContent';
import bodBanner from '../../assets/image/about-bod-bg.png';

const NAV_BORDER = '#c8cee3';

const TEAL = '#40C9BF';
const ORANGE = '#ED6E2A';

const subNavItems = [
  { id: 'who-we-are', label: 'WHO WE ARE', href: '/about-us' },
  { id: 'mission-vision', label: 'OUR MISSION & VISION', href: '/about-us#mission-vision' },
  { id: 'core-values', label: 'OUR CORE VALUES', href: '/about-us#core-values' },
  { id: 'awards', label: 'AWARDS', href: '/about-us#awards' },
  { id: 'board', label: 'BOARD OF DIRECTORS', href: '/board-of-directors' },
  { id: 'management', label: 'SENIOR MANAGEMENT', href: '/about-us#management' },
];

export function BoardOfDirectorsHeroSection() {
  const location = useLocation();
  return (
    <PageHeroContent
      bannerImageUrl={bodBanner}
      bannerImagePositionX="center"
      bannerImagePositionY="bottom"
      backgroundColor={TEAL}
      sectionStyle={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and subtitle row - vertically centered */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1
                className="uppercase tracking-tight"
                style={{
                  color: TEAL,
                  fontFamily: 'Museo900-Regular, Museo, sans-serif',
                  fontSize: '26px',
                }}
              >
                About Us
              </h1>
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-gray-400" aria-hidden />
              <span className="text-sm font-normal uppercase tracking-wide text-gray-400">
                BOARD OF DIRECTORS
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors text-[#40C9BF] border-[#40C9BF] hover:bg-[#40C9BF] hover:text-white"
              >
                GET A CALL BACK
              </a>
              <Link
                to="/about-us#join"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors bg-transparent text-[#EE6E2A] border-[#EE6E2A] hover:bg-[#EE6E2A] hover:text-white"
              >
                JOIN PORTS SACCO
              </Link>
            </div>
          </div>

          {/* Sub-navigation - top border reaches parent; separators full height */}
          <nav
            className="mt-6 -mx-4 sm:-mx-6 pt-0"
            style={{
              borderTop: `2px solid ${NAV_BORDER}`,
              backgroundColor: '#eef2f8',
            }}
            aria-label="About us sections"
          >
            <ul className="flex flex-wrap md:flex-nowrap items-stretch uppercase tracking-wide px-4 sm:px-6">
              {subNavItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex w-full md:flex-1 md:min-w-0 items-center justify-center border-b-2 md:border-b-0 ${index === 0 ? 'md:border-l-0' : 'md:border-l-2'}`}
                  style={{
                    borderColor: NAV_BORDER,
                  }}
                >
                  {(() => {
                    const isActive = item.href === '/board-of-directors' && location.pathname === '/board-of-directors';
                    return item.href ? (
                      <Link
                        to={item.href}
                        className={`py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center transition-colors hover:text-[#ED6E2A] whitespace-normal break-words ${isActive ? 'text-[#ED6E2A]' : 'text-[#65605f]'}`}
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '14px',
                        }}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={`#${item.id}`}
                        className={`py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center transition-colors hover:text-[#ED6E2A] whitespace-normal break-words text-[#65605f]`}
                        style={{
                          fontWeight: 400,
                          fontSize: '14px',
                        }}
                      >
                        {item.label}
                      </a>
                    );
                  })()}
                </li>
              ))}
            </ul>
          </nav>
    </PageHeroContent>
  );
}
