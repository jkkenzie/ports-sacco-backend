import React from 'react';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function DownloadAppBlock({
  heading = 'Download the App',
  anchor,
  backgroundColor = '#22ACB6',
  headingColor = '#ffffff',
  googlePlayImageUrl = '',
  googlePlayLinkUrl = '#',
  appStoreImageUrl = '',
  appStoreLinkUrl = '#',
}) {
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(heading);
  const id = explicitAnchor || derived || 'download-app';

  const hasAny = Boolean(String(heading || '').trim() || googlePlayImageUrl || appStoreImageUrl);
  if (!hasAny) return null;

  return (
    <section
      id={id}
      className="w-full py-[60px] px-6 lg:py-[60px]"
      style={{
        fontFamily: 'Museo, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || '#22ACB6',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-6" style={{ color: headingColor || '#ffffff', fontFamily: 'Museo900-Regular, Museo, sans-serif' }}>
            {heading}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {googlePlayImageUrl ? (
              <a href={googlePlayLinkUrl || '#'} className="inline-block">
                <img src={googlePlayImageUrl} alt="Get it on Google Play" className="h-auto" style={{ maxHeight: '60px' }} />
              </a>
            ) : null}
            {appStoreImageUrl ? (
              <a href={appStoreLinkUrl || '#'} className="inline-block">
                <img src={appStoreImageUrl} alt="Download on the App Store" className="h-auto" style={{ maxHeight: '60px' }} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

