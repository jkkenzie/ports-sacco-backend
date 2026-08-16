import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroContent } from '../components/PageHeroContent';
import {
  menuHref,
  menuLinkRel,
  menuRouterPath,
  normalizeMenuTarget,
  shouldUseNativeAnchor,
} from '../utils/menuLink';

const DEFAULT_BG = '#22ABB5';
const DEFAULT_TITLE = '#22ABB5';
const DEFAULT_NAV_BG = '#eef2f8';
const DEFAULT_NAV_BORDER = '#c8cee3';
const DEFAULT_MENU_TEXT = '#65605f';
const DEFAULT_MENU_HOVER_TEXT = '#ED6E2A';
const DEFAULT_MENU_HOVER_BG = '#eef2f8';

function HeroLink({ href, target, className, style, tabIndex, children }) {
  const anchorHref = menuHref(href);
  const routerTo = menuRouterPath(href);
  const resolvedTarget = normalizeMenuTarget(target);

  if (shouldUseNativeAnchor(href, resolvedTarget)) {
    return (
      <a
        href={anchorHref}
        className={className}
        style={style}
        target={resolvedTarget}
        rel={menuLinkRel(resolvedTarget)}
        tabIndex={tabIndex}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={routerTo} className={className} style={style} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

function HeroButton({ button, index }) {
  const anchorHref = menuHref(button.url);
  const routerTo = menuRouterPath(button.url);
  const target = normalizeMenuTarget(button.target);
  const className =
    'inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 font-semibold text-xs uppercase tracking-wider transition-colors hero-page-btn';

  const textColor = button.textColor || (index === 1 ? '#ed6e2a' : '#22abb5');
  const borderColor = button.borderColor || textColor;

  const style = {
    color: textColor,
    borderColor,
    backgroundColor: button.bgColor || 'transparent',
    '--hero-btn-hover-text': button.hoverTextColor || '#ffffff',
    '--hero-btn-hover-bg': button.hoverBgColor || borderColor,
    '--hero-btn-hover-border': button.hoverBorderColor || borderColor,
  };

  if (shouldUseNativeAnchor(button.url, target)) {
    return (
      <a
        href={anchorHref}
        className={className}
        style={style}
        target={target}
        rel={menuLinkRel(target)}
      >
        {button.label}
      </a>
    );
  }

  return (
    <Link to={routerTo} className={className} style={style}>
      {button.label}
    </Link>
  );
}

/**
 * Gutenberg block: custom/savings-archive-hero — Page Hero Content
 */
export function SavingsArchiveHeroBlock({
  title = 'Savings Products',
  intro = '',
  bannerImageUrl = '',
  bannerImagePositionX = 'center',
  bannerImagePositionY = 'bottom',
  backgroundColor = DEFAULT_BG,
  titleColor = DEFAULT_TITLE,
  navBackgroundColor = DEFAULT_NAV_BG,
  navBorderColor = DEFAULT_NAV_BORDER,
  menuTextColor = DEFAULT_MENU_TEXT,
  menuHoverTextColor = DEFAULT_MENU_HOVER_TEXT,
  menuHoverBackgroundColor = DEFAULT_MENU_HOVER_BG,
  buttons = [],
  menuItems = [],
  showMenu = true,
}) {
  const navLabel = title ? `${title} navigation` : 'Page navigation';
  const menuVisible = showMenu !== false;
  const menuSlots =
    Array.isArray(menuItems) && menuItems.length > 0
      ? menuItems
      : [{ label: '\u00a0', href: '#', target: '' }];

  return (
    <PageHeroContent
      bannerImageUrl={bannerImageUrl}
      bannerImagePositionX={bannerImagePositionX}
      bannerImagePositionY={bannerImagePositionY}
      backgroundColor={backgroundColor || DEFAULT_BG}
      sectionStyle={{
        '--hero-menu-text': menuTextColor || DEFAULT_MENU_TEXT,
        '--hero-menu-hover-text': menuHoverTextColor || DEFAULT_MENU_HOVER_TEXT,
        '--hero-menu-hover-bg': menuHoverBackgroundColor || DEFAULT_MENU_HOVER_BG,
      }}
      extraStyles={`
        .page-hero-content .hero-page-btn:hover {
          color: var(--hero-btn-hover-text, #fff) !important;
          background-color: var(--hero-btn-hover-bg, #22abb5) !important;
          border-color: var(--hero-btn-hover-border, #22abb5) !important;
        }
        .page-hero-content .hero-menu-link {
          color: var(--hero-menu-text, #65605f);
        }
        .page-hero-content .hero-menu-link:hover {
          color: var(--hero-menu-hover-text, #ed6e2a);
          background-color: var(--hero-menu-hover-bg, #eef2f8);
          font-weight: 700;
        }
      `}
    >
      <div className="flex flex-col lg:flex-row px-7 lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1
            className="uppercase tracking-tight"
            style={{
              color: titleColor || DEFAULT_TITLE,
              fontFamily: 'Museo900-Regular, Museo, sans-serif',
              fontSize: '28px',
              fontWeight: 800,
            }}
          >
            {title}
          </h1>
          {intro ? (
            <p className="text-base" style={{ color: '#65605f' }}>
              {intro}
            </p>
          ) : null}
        </div>

        {buttons.length > 0 ? (
          <div className="flex flex-wrap gap-3 items-center">
            {buttons.map((btn, index) => (
              <HeroButton key={`${btn.label}-${index}`} button={btn} index={index} />
            ))}
          </div>
        ) : null}
      </div>

      <nav
        className="mt-6 -mx-4 sm:-mx-6 pt-0"
        style={{
          borderTop: `2px solid ${navBorderColor || DEFAULT_NAV_BORDER}`,
          backgroundColor: navBackgroundColor || DEFAULT_NAV_BG,
        }}
        aria-label={navLabel}
        aria-hidden={menuVisible ? undefined : true}
      >
        <ul className="flex flex-wrap md:flex-nowrap items-stretch uppercase tracking-wide px-4 sm:px-6">
          {menuSlots.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className={`flex w-full md:flex-1 md:min-w-0 items-center justify-center border-b-2 md:border-b-0 ${index === 0 ? 'md:border-l-0' : 'md:border-l-2'}`}
              style={{ borderColor: navBorderColor || DEFAULT_NAV_BORDER }}
            >
              <HeroLink
                href={item.href}
                target={item.target}
                className={`hero-menu-link py-2 px-2 w-full md:py-6 text-center min-[480px]:text-left md:text-center text-[14px] transition-colors whitespace-normal break-words${
                  menuVisible ? '' : ' invisible pointer-events-none select-none'
                }`}
                tabIndex={menuVisible ? undefined : -1}
              >
                {item.label}
              </HeroLink>
            </li>
          ))}
        </ul>
      </nav>
    </PageHeroContent>
  );
}
