import React from 'react';
import { Link } from 'react-router-dom';
import { decodeHtmlEntities } from './CoreRichTextBlocks';
import { menuHref, shouldUseNativeAnchor } from '../utils/menuLink';

const DEFAULT_ENTRIES = [
  {
    title: 'Existing Member Registration to Portal',
    paragraph:
      'If you are a member of our SACCO but not registered on our portal, please click on the link below to go to the existing member registration page.',
    linkText: 'Register Here >>',
    linkUrl: 'https://portal.portsacco.co.ke/user/register',
  },
  {
    title: 'New Member Registration',
    paragraph:
      'If you are not a member of our SACCO, you can join us by clicking on the register link below to go to the new member registration page.',
    linkText: 'Register Here >>',
    linkUrl: '/new-member-registration/',
  },
];

function normalizeEntries(entries) {
  const saved = Array.isArray(entries) ? entries : [];
  return [0, 1].map((i) => {
    const d = DEFAULT_ENTRIES[i];
    const s = saved[i] && typeof saved[i] === 'object' ? saved[i] : {};
    return {
      title: String(s.title || d.title || '').trim(),
      paragraph: String(s.paragraph || d.paragraph || '').trim(),
      linkText: String(s.linkText || d.linkText || '').trim(),
      linkUrl: String(s.linkUrl || d.linkUrl || '').trim(),
    };
  });
}

function RegistrationLink({ url, text, color }) {
  const cleanText = String(text || '').trim();
  const cleanUrl = String(url || '').trim();
  if (!cleanText || !cleanUrl) return null;

  if (shouldUseNativeAnchor(cleanUrl, '')) {
    return (
      <a
        href={menuHref(cleanUrl)}
        style={{ color }}
        className="font-semibold hover:opacity-80 transition-opacity"
      >
        {decodeHtmlEntities(cleanText)}
      </a>
    );
  }

  return (
    <Link to={cleanUrl} style={{ color }} className="font-semibold hover:opacity-80 transition-opacity">
      {decodeHtmlEntities(cleanText)}
    </Link>
  );
}

export function RegistrationLinksBlock({
  imageUrl = '',
  imageAlt = 'Registration',
  entries = [],
  titleColor = '#333333',
  textColor = '#333333',
  linkColor = '#eb651b',
  sectionBgColor = '#ffffff',
}) {
  const rows = normalizeEntries(entries);

  return (
    <section className="w-full py-10 lg:py-12" style={{ backgroundColor: sectionBgColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            {imageUrl ? (
              <img src={imageUrl} alt={imageAlt || 'Registration'} className="max-w-full h-auto object-contain" />
            ) : null}
          </div>

          <div className="space-y-8">
            {rows.map((entry, idx) => (
              <div key={`${entry.title}-${idx}`}>
                {entry.title ? (
                  <h4
                    className="mb-2"
                    style={{ color: titleColor || '#333333', fontFamily: 'Museo900-Regular, Museo, sans-serif', fontSize: '24px' }}
                  >
                    {decodeHtmlEntities(entry.title)}
                  </h4>
                ) : null}
                {entry.paragraph ? (
                  <p
                    className="mb-2"
                    style={{ color: textColor || '#333333', lineHeight: 1.6, fontFamily: 'sans-serif, Helvetica, sans-serif' }}
                  >
                    {decodeHtmlEntities(entry.paragraph)}
                  </p>
                ) : null}
                <RegistrationLink url={entry.linkUrl} text={entry.linkText} color={linkColor || '#eb651b'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
