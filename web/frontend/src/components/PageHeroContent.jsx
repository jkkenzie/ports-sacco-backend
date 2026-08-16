import React, { useRef } from 'react';
import { useContentTouchesViewportEdges } from '../hooks/useContentTouchesViewportEdges';

const PAGE_HERO_LAYOUT_STYLES = `
  .page-hero-content .page-hero-banner-wrap--overlay {
    display: grid;
    grid-template-columns: 1fr;
  }
  .page-hero-content .page-hero-banner-wrap--overlay .page-hero-banner-shim,
  .page-hero-content .page-hero-banner-wrap--overlay .page-hero-banner,
  .page-hero-content .page-hero-banner-wrap--overlay .page-hero-content-panel {
    grid-column-start: 1;
    grid-row-start: 1;
  }
  .page-hero-content .page-hero-banner-wrap--overlay .page-hero-banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
  .page-hero-content .page-hero-banner-wrap--overlay .page-hero-content-panel {
    align-self: end;
    width: 100%;
  }
`;

const DEFAULT_PANEL_CLASS =
  'relative z-10 bg-white max-w-7xl mx-auto w-full px-4 sm:px-6 pb-0 pt-[25px]';

/**
 * Shared page hero layout: full-width banner + white content panel.
 * Banner is relative when the panel spans the viewport; absolute overlay when max-w-7xl is inset.
 */
export function PageHeroContent({
  bannerImageUrl = '',
  bannerImagePositionX = 'center',
  bannerImagePositionY = 'bottom',
  backgroundColor = '#22ABB5',
  sectionClassName = '',
  sectionStyle = {},
  contentPanelClassName = DEFAULT_PANEL_CLASS,
  contentPanelStyle = {},
  extraStyles = '',
  children,
}) {
  const posX = bannerImagePositionX || 'center';
  const posY = bannerImagePositionY || 'bottom';
  const contentPanelRef = useRef(null);
  const contentTouchesViewport = useContentTouchesViewportEdges(contentPanelRef);
  const useOverlayBanner = Boolean(bannerImageUrl) && !contentTouchesViewport;

  return (
    <section
      className={`page-hero-content relative w-full overflow-hidden flex flex-col ${sectionClassName}`.trim()}
      style={{
        fontFamily: 'Museo, Helvetica, sans-serif',
        backgroundColor,
        ...sectionStyle,
      }}
    >
      <style>{`${PAGE_HERO_LAYOUT_STYLES}${extraStyles}`}</style>
      <div
        className={`page-hero-banner-wrap relative w-full flex flex-col${useOverlayBanner ? ' page-hero-banner-wrap--overlay' : ''}`}
      >
        {bannerImageUrl ? (
          <>
            {useOverlayBanner ? (
              <img
                src={bannerImageUrl}
                alt=""
                aria-hidden
                tabIndex={-1}
                className="page-hero-banner-shim w-full h-auto opacity-0 pointer-events-none"
              />
            ) : null}
            <img
              src={bannerImageUrl}
              alt=""
              className={`page-hero-banner block w-full h-auto${useOverlayBanner ? '' : ' relative'}`}
              style={{
                objectPosition: `${posX} ${posY}`,
                animation: 'fadeIn 0.8s ease-out forwards',
              }}
            />
          </>
        ) : null}
        <div
          ref={contentPanelRef}
          className={`page-hero-content-panel ${contentPanelClassName}`.trim()}
          style={{ animation: 'fadeInUp 0.8s ease-out', ...contentPanelStyle }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
