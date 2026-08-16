import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeroContent } from './PageHeroContent';

const NAV_BORDER = '#c8cee3';
const TEAL = '#22ABB5';

const jiendelezeTabs = [
  { id: 'about', label: 'ABOUT THIS LOAN' },
  { id: 'features', label: 'FEATURES & BENEFITS' },
  { id: 'eligibility', label: 'ELIGIBILITY' },
  { id: 'faq', label: "FAQ'S" },
  { id: 'apply', label: 'APPLY NOW' },
];

export function JiendelezeLoanHeroSection({ bannerImage }) {
  useLocation();

  return (
    <PageHeroContent
      bannerImageUrl={bannerImage}
      bannerImagePositionX="center"
      bannerImagePositionY="bottom"
      backgroundColor={TEAL}
    >
          <div className="flex flex-col lg:flex-row px-7 lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1
                className="tracking-tight"
                style={{
                  color: TEAL,
                  fontFamily: 'Museo900-Regular, Museo, sans-serif',
                  fontSize: '28px',
                  fontWeight: 800,
                }}
              >
                Jiendeleze Loans
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#apply"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors text-[#22abb5] border-[#22abb5] hover:bg-[#22abb5] hover:text-white"
              >
                GET A CALL BACK
              </a>
              <Link
                to="#"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors bg-transparent text-[#ed6e2a] border-[#ed6e2a] hover:bg-[#ed6e2a] hover:text-white"
              >
                LOAN CALCULATOR
              </Link>
            </div>
          </div>

          <nav
            className="mt-6 -mx-4 sm:-mx-6 pt-0"
            style={{
              borderTop: `2px solid ${NAV_BORDER}`,
              backgroundColor: '#eef2f8',
            }}
            aria-label="Jiendeleze tabs"
          >
            <ul className="flex flex-wrap md:flex-nowrap items-stretch uppercase tracking-wide px-4 sm:px-6">
              {jiendelezeTabs.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex w-full md:flex-1 md:min-w-0 items-center justify-center border-b-2 md:border-b-0 ${
                    index === 0 ? 'md:border-l-0' : 'md:border-l-2'
                  }`}
                  style={{ borderColor: NAV_BORDER }}
                >
                  <a
                    href={`#${item.id}`}
                    className={`py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center text-[14px] transition-colors hover:text-[#ED6E2A] hover:font-bold whitespace-normal break-words ${
                      index === 0 ? 'text-[#65605f] font-bold' : 'text-[#65605f]'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
    </PageHeroContent>
  );
}

