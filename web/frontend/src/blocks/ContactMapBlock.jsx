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

function resolveMapSrc(input) {
  const raw = typeof input === 'string' ? input.trim() : '';
  if (!raw) return '';

  // Support pasted full iframe embed HTML by extracting the src attribute.
  const iframeSrcMatch = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return iframeSrcMatch[1].trim();
  }

  return raw;
}

export function ContactMapBlock({
  title = 'Our Location',
  address = 'Mombasa, Kenya',
  embedUrl = '',
  directionsUrl = '',
  anchor,
  backgroundColor = '#ffffff',
  titleColor = '#22ACB6',
  textColor = '#000000',
  cardBgColor = '#ffffff',
}) {
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const id = explicitAnchor || slugifyId(title) || 'contact-map';
  const mapSrc = resolveMapSrc(embedUrl);

  return (
    <section id={id} className="w-full bg-white py-12 lg:py-16" style={{ fontFamily: 'Museo, Helvetica, sans-serif', backgroundColor, scrollMarginTop: '10px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-[30px]">
        <div className="w-full px-0 md:px-[30px]" style={{ backgroundColor: cardBgColor, height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
          {mapSrc ? (
            <div className="w-full h-full overflow-hidden rounded-md border border-neutral-200">
              <iframe
                src={mapSrc}
                title="Contact Location Map"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <p className="text-sm text-neutral-500 p-4">Add a Google Maps embed URL in the block settings to show the map.</p>
          )}
          {directionsUrl && address ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 ml-1 text-sm font-semibold underline"
              style={{ color: textColor }}
            >
              Get directions
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

