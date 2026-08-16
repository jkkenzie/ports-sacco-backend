import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { getFooterData, FALLBACK_FOOTER_DATA } from '../services/footerApi';

const TEAL = '#22ACB6';

function YouTubeIcon({ className, style }) {
  return (
    <svg viewBox="0 0 46.71 15.24" className={className} style={style}>
      <g>
        <path d="M3.93,5.9L5.34,0h2.32l-2.65,8.63v6.12h-2.28v-5.85L0,0h2.31l1.48,5.9h.14Z" />
        <path d="M11.36,3.59c.83,0,1.52.26,2.06.79.53.53.8,1.21.8,2.04v5.62c0,.93-.26,1.66-.79,2.19-.52.53-1.24.8-2.16.8s-1.59-.28-2.12-.83c-.53-.54-.8-1.28-.8-2.2v-5.64c0-.84.27-1.52.82-2.02.54-.5,1.27-.74,2.19-.74Z" />
      </g>
      <g>
        <path d="M43.08.25c-4.7-.32-9.8-.34-15.23,0-2,0-3.63,1.62-3.63,3.63v7.45c0,2,1.62,3.63,3.63,3.63,5.06.38,10.13.38,15.23,0,2,0,3.63-1.62,3.63-3.63V3.88c0-2-1.62-3.63-3.63-3.63Z" />
      </g>
    </svg>
  );
}

function normalizeSvgToCurrentColor(svgMarkup, options = {}) {
  if (!svgMarkup || typeof svgMarkup !== 'string') {
    return '';
  }
  const preserveWhiteWith = options.preserveWhiteWith || '';
  let svg = svgMarkup;
  if (preserveWhiteWith) {
    svg = svg
      .replace(/fill="(?:#fff|#ffffff|white)"/gi, `fill="${preserveWhiteWith}"`)
      .replace(/fill='(?:#fff|#ffffff|white)'/gi, `fill='${preserveWhiteWith}'`)
      .replace(/style="([^"]*?)fill\s*:\s*(?:#fff|#ffffff|white)\s*;?([^"]*?)"/gi, 'style="$1fill:' + preserveWhiteWith + ';$2"');
  }
  return svg
    .replace(/class="([^"]*)"/gi, (match, cls) => {
      const cleaned = String(cls)
        .split(/\s+/)
        .filter((c) => c && c !== 'text-white')
        .join(' ');
      return cleaned ? `class="${cleaned}"` : '';
    })
    .replace(/class='([^']*)'/gi, (match, cls) => {
      const cleaned = String(cls)
        .split(/\s+/)
        .filter((c) => c && c !== 'text-white')
        .join(' ');
      return cleaned ? `class='${cleaned}'` : '';
    })
    .replace(/fill="(?!none)(?!currentColor)([^"]*)"/gi, 'fill="var(--icon-fill)"')
    .replace(/fill='(?!none)(?!currentColor)([^']*)'/gi, "fill='var(--icon-fill)'")
    .replace(/fill="currentColor"/gi, 'fill="var(--icon-fill)"')
    .replace(/stroke="(?!none)(?!currentColor)([^"]*)"/gi, 'stroke="var(--icon-fill)"')
    .replace(/stroke='(?!none)(?!currentColor)([^']*)'/gi, "stroke='var(--icon-fill)'")
    .replace(/style="([^"]*?)fill\s*:\s*(?!none)(?!currentColor)([^;"]+)\s*;?([^"]*?)"/gi, 'style="$1fill:var(--icon-fill);$3"')
    .replace(/style="([^"]*?)stroke\s*:\s*(?!none)(?!currentColor)([^;"]+)\s*;?([^"]*?)"/gi, 'style="$1stroke:var(--icon-fill);$3"')
    .replace(/style="([^"]*?)color\s*:\s*[^;"]+\s*;?([^"]*?)"/gi, 'style="$1color:var(--icon-fill);$2"');
}

function UploadedIcon({ asset, fallback, className, style, color, internalColor }) {
  const svg = asset?.svg ? normalizeSvgToCurrentColor(asset.svg, { preserveWhiteWith: 'var(--icon-internal-fill)' }) : '';
  if (svg) {
    return (
      <span
        className={className}
        style={{
          ...style,
          color: color,
          fill: color,
          '--icon-fill': color,
          '--icon-internal-fill': internalColor || color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  if (asset?.url) {
    return <img src={asset.url} alt="" className={className} style={style} />;
  }

  return fallback;
}

function toSpaPath(url) {
  if (!url || url === '#') {
    return '';
  }
  if (url.startsWith('/')) {
    return url;
  }
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin !== window.location.origin) {
      return '';
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/';
  } catch {
    return '';
  }
}

function toExternalUrl(url) {
  const value = String(url || '').trim();
  if (!value || value === '#') {
    return '';
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith('//')) {
    return `https:${value}`;
  }
  if (value.startsWith('www.')) {
    return `https://${value}`;
  }
  return '';
}

function FooterNavLink({ href, className, style, children, onMouseEnter, onMouseLeave }) {
  const spaPath = toSpaPath(href || '');
  if (spaPath) {
    return (
      <Link to={spaPath} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href || '#'} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </a>
  );
}

export function FooterWpSection({ portsSaccoLogo, googlePlayWhiteSvg, iosIconWhiteSvg, callIcon, atIcon, addressIcon, boxAddressIcon }) {
  const [data, setData] = useState(FALLBACK_FOOTER_DATA);
  const [hoveredAppIcon, setHoveredAppIcon] = useState('');
  const [hoveredSocialIcon, setHoveredSocialIcon] = useState('');
  const [hoveredBottomLink, setHoveredBottomLink] = useState('');
  const [hoveredContactLink, setHoveredContactLink] = useState('');

  useEffect(() => {
    let active = true;
    getFooterData().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const branches = Array.isArray(data.branches) ? data.branches : [];
  const left = branches.slice(0, 2);
  const right = branches.slice(2, 4);
  const rightFirst = right[0] || null;
  const rightSecond = right[1] || null;
  const contactColor = data.contact.iconColor || '#FFFFFF';
  const appIconColor = data.appLinks.iconColor || '#FFFFFF';
  const appIconHoverColor = data.appLinks.iconHoverColor || '#22ACB6';
  const googleColor = hoveredAppIcon === 'google' ? appIconHoverColor : appIconColor;
  const iosColor = hoveredAppIcon === 'ios' ? appIconHoverColor : appIconColor;
  const appIconWidth = Number(data.appLinks.iconWidth) > 0 ? Number(data.appLinks.iconWidth) : 144;
  const appIconHeight = Number(data.appLinks.iconHeight) > 0 ? Number(data.appLinks.iconHeight) : 48;
  const socialColor = data.socials.iconColor || '#FFFFFF';
  const socialHoverColor = data.socials.iconHoverColor || '#22ACB6';
  const getSocialColor = (id) => (hoveredSocialIcon === id ? socialHoverColor : socialColor);
  const youtubeInternalColor = data.socials.youtubeInternalColor || '#FFFFFF';
  const bottomLinkColor = data.bottom.linkColor || '#22ACB6';
  const bottomLinkHoverColor = data.bottom.linkHoverColor || '#FFFFFF';
  const getBottomLinkColor = (id) => (hoveredBottomLink === id ? bottomLinkHoverColor : bottomLinkColor);
  const contactHoverColor = data.contact.linkHoverColor || TEAL;
  const getContactLinkColor = (id) => (hoveredContactLink === id ? contactHoverColor : '#FFFFFF');
  const creditExternalUrl = toExternalUrl(data.bottom.creditUrl);
  const logoSrc = data.contact.logo?.url || portsSaccoLogo;

  const officeAddressHref = toExternalUrl(data.contact.officeAddressUrl);
  const phoneHref = String(data.contact.phoneUrl || '').trim() || (data.contact.phone ? `tel:${String(data.contact.phone).replace(/[^0-9+]/g, '')}` : '');
  const emailHref = String(data.contact.emailUrl || '').trim() || (data.contact.email ? `mailto:${String(data.contact.email).trim()}` : '');

  return (
    <div data-footer-source="wp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-4 lg:gap-4 relative">
          <div className="flex flex-col relative pr-4 md:pr-8 md:border-r" style={{ borderRightColor: TEAL, borderRightWidth: '2px' }}>
            <div className="inline-flex flex-col items-start" style={{ maxWidth: 'fit-content' }}>
              <img src={logoSrc} alt="Ports Sacco" className="h-16 w-auto mb-0 object-contain" />
              <p className="text-xs uppercase tracking-widest mb-6 -mt-3" style={{ fontFamily: 'GothamRounded-Book, sans-serif', color: '#82cdcb', fontSize: '7.49px', letterSpacing: '0.29em', width: '100%', boxSizing: 'border-box' }}>
                {data.contact.tagline}
              </p>
            </div>
            <h3 className="font-bold mb-4 uppercase" style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.contact.title}</h3>
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-1">
                <UploadedIcon
                  asset={data.contact.addressIcon}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  color={contactColor}
                  fallback={<img src={addressIcon} alt="Address" className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                />
                <div>
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{data.contact.officeName}</p>
                  {officeAddressHref ? (
                    <a
                      href={officeAddressHref}
                      className="text-sm leading-relaxed "
                      style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px', color: getContactLinkColor('address') }}
                      onMouseEnter={() => setHoveredContactLink('address')}
                      onMouseLeave={() => setHoveredContactLink('')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.contact.officeAddress}
                    </a>
                  ) : (
                    <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{data.contact.officeAddress}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <UploadedIcon asset={data.contact.phoneIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" color={contactColor} fallback={<img src={callIcon} alt="Phone" className="w-5 h-5 flex-shrink-0 mt-0.5" />} />
                {phoneHref && phoneHref !== 'tel:' ? (
                  <a
                    href={phoneHref}
                    className="text-sm"
                    style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px', color: getContactLinkColor('phone') }}
                    onMouseEnter={() => setHoveredContactLink('phone')}
                    onMouseLeave={() => setHoveredContactLink('')}
                  >
                    {data.contact.phone}
                  </a>
                ) : (
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{data.contact.phone}</p>
                )}
              </div>
              <div className="flex items-start gap-2 mb-1">
                <UploadedIcon asset={data.contact.poBoxIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" color={contactColor} fallback={<img src={boxAddressIcon} alt="P.O Box" className="w-5 h-5 flex-shrink-0 mt-0.5" />} />
                <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{data.contact.poBox}</p>
              </div>
              <div className="flex items-start gap-2">
                <UploadedIcon asset={data.contact.emailIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" color={contactColor} fallback={<img src={atIcon} alt="Email" className="w-5 h-5 flex-shrink-0 mt-0.5" />} />
                {emailHref && emailHref !== 'mailto:' ? (
                  <a
                    href={emailHref}
                    className="text-sm break-all"
                    style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px', color: getContactLinkColor('email') }}
                    onMouseEnter={() => setHoveredContactLink('email')}
                    onMouseLeave={() => setHoveredContactLink('')}
                  >
                    {data.contact.email}
                  </a>
                ) : (
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{data.contact.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col relative px-4 md:px-8 md:border-r" style={{ borderRightColor: TEAL, borderRightWidth: '2px' }}>
            <style>{`
              @media (max-width: 480px) {
                .download-app-title-wp {
                  text-align: left !important;
                }
                .download-app-buttons-wp {
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  justify-content: flex-start !important;
                }
                .branch-listings-grid-wp {
                  grid-template-columns: 1fr !important;
                }
                .branch-listings-divider-wp {
                  display: none !important;
                }
                .branch-left-column-wp {
                  padding-right: 0 !important;
                }
                .branch-right-column-wp {
                  padding-left: 0 !important;
                }
                .kisumu-office-divider-wp {
                  display: block !important;
                  border-top: 2px solid ${TEAL} !important;
                  margin-top: 1rem !important;
                  margin-bottom: 1rem !important;
                }
              }
              .kisumu-office-divider-wp {
                display: none;
              }
              @media (min-width: 481px) {
                .download-app-title-wp {
                  text-align: center !important;
                }
                .download-app-buttons-wp {
                  flex-direction: row !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
              }
            `}</style>
            <h3 className="download-app-title-wp text-white font-bold mb-4 uppercase" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{data.appLinks.title}</h3>
            <div className="download-app-buttons-wp flex flex-col gap-3 mb-4">
              <a
                href={data.appLinks.googlePlayUrl || '#'}
                className="inline-block"
                onMouseEnter={() => setHoveredAppIcon('google')}
                onMouseLeave={() => setHoveredAppIcon('')}
              >
                <UploadedIcon
                  asset={data.appLinks.googlePlayIcon}
                  className="w-auto"
                  style={{ width: `${appIconWidth}px`, height: `${appIconHeight}px` }}
                  color={googleColor}
                  fallback={<img src={googlePlayWhiteSvg} alt="Get it on Google Play" className="w-auto" style={{ width: `${appIconWidth}px`, height: `${appIconHeight}px` }} />}
                />
              </a>
              <a
                href={data.appLinks.appStoreUrl || '#'}
                className="inline-block"
                onMouseEnter={() => setHoveredAppIcon('ios')}
                onMouseLeave={() => setHoveredAppIcon('')}
              >
                <UploadedIcon
                  asset={data.appLinks.appStoreIcon}
                  className="w-auto"
                  style={{ width: `${appIconWidth}px`, height: `${appIconHeight}px` }}
                  color={iosColor}
                  fallback={<img src={iosIconWhiteSvg} alt="Download on the App Store" className="w-auto" style={{ width: `${appIconWidth}px`, height: `${appIconHeight}px` }} />}
                />
              </a>
            </div>
            <div className="border-b mb-4" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }} />
            <div className="branch-listings-grid-wp grid grid-cols-2 gap-4 relative">
              <div className="branch-listings-divider-wp absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: TEAL, transform: 'translateX(-50%)' }} />
              <div className="branch-left-column-wp flex flex-col pr-4">
                {left.map((branch, index) => (
                  <div key={`left-${index}`} className="pb-4 mb-4">
                    <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{branch.name}</p>
                    <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branch.address}</p>
                    <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branch.phone}</p>
                  </div>
                ))}
              </div>
              <div className="branch-right-column-wp flex flex-col pl-4">
                <div className="kisumu-office-divider-wp" />
                {rightFirst && (
                  <div className="pb-4 border-b mb-4" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }}>
                    <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{rightFirst.name}</p>
                    <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{rightFirst.address}</p>
                    <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{rightFirst.phone}</p>
                  </div>
                )}
                {rightSecond && (
                  <div className="pb-4">
                    <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{rightSecond.name}</p>
                    <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{rightSecond.address}</p>
                    <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{rightSecond.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col relative pl-4 md:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>Follow Us</h3>
            <div className="flex gap-4 mb-6 flex-wrap">
              <a href={data.socials.facebook || '#'} className="hover:opacity-80 transition-opacity" onMouseEnter={() => setHoveredSocialIcon('facebook')} onMouseLeave={() => setHoveredSocialIcon('')}>
                <UploadedIcon asset={data.socials.facebookIcon} className="w-5 h-5" color={getSocialColor('facebook')} fallback={<FaFacebookF className="w-5 h-5" style={{ color: getSocialColor('facebook'), fill: getSocialColor('facebook') }} />} />
              </a>
              <a href={data.socials.twitter || '#'} className="hover:opacity-80 transition-opacity" onMouseEnter={() => setHoveredSocialIcon('twitter')} onMouseLeave={() => setHoveredSocialIcon('')}>
                <UploadedIcon asset={data.socials.twitterIcon} className="w-5 h-5" color={getSocialColor('twitter')} fallback={<FaXTwitter className="w-5 h-5" style={{ color: getSocialColor('twitter'), fill: getSocialColor('twitter') }} />} />
              </a>
              <a href={data.socials.instagram || '#'} className="hover:opacity-80 transition-opacity" onMouseEnter={() => setHoveredSocialIcon('instagram')} onMouseLeave={() => setHoveredSocialIcon('')}>
                <UploadedIcon asset={data.socials.instagramIcon} className="w-5 h-5" color={getSocialColor('instagram')} fallback={<FaInstagram className="w-5 h-5" style={{ color: getSocialColor('instagram'), fill: getSocialColor('instagram') }} />} />
              </a>
              <a href={data.socials.linkedin || '#'} className="hover:opacity-80 transition-opacity" onMouseEnter={() => setHoveredSocialIcon('linkedin')} onMouseLeave={() => setHoveredSocialIcon('')}>
                <UploadedIcon asset={data.socials.linkedinIcon} className="w-5 h-5" color={getSocialColor('linkedin')} fallback={<FaLinkedinIn className="w-5 h-5" style={{ color: getSocialColor('linkedin'), fill: getSocialColor('linkedin') }} />} />
              </a>
              <a href={data.socials.youtube || '#'} className="hover:opacity-80 transition-opacity" onMouseEnter={() => setHoveredSocialIcon('youtube')} onMouseLeave={() => setHoveredSocialIcon('')}>
                <UploadedIcon
                  asset={data.socials.youtubeIcon}
                  className="w-16 h-5"
                  color={getSocialColor('youtube')}
                  internalColor={youtubeInternalColor}
                  fallback={<YouTubeIcon className="w-16 h-5" style={{ fill: getSocialColor('youtube') }} />}
                />
              </a>
            </div>
            <div className="border-b mb-6" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }} />
            <h3 className="text-white font-bold mb-4 uppercase" style={{ fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.title}</h3>
            <div className="space-y-2">
              <div className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.weekdaysLabel}</div>
              <div className="text-white text-sm pb-2" style={{ fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.weekdaysTime}</div>
              <div className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.saturdayLabel}</div>
              <div className="text-white text-sm pb-2" style={{ fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.saturdayTime}</div>
              <div><span className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.sundayLabel}</span><span className="text-white text-sm ml-2" style={{ fontFamily: 'Museo900-Regular, Museo', fontSize: '19.82px' }}>{data.hours.sundayTime}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4">
        <div className="w-full px-4 sm:px-6">
          <style>{`
            .copyright-text-wp {
              font-family: 'GothamRounded-Bold', sans-serif;
              font-size: 9px;
              letter-spacing: 0.15em;
            }
            .copyright-ls-26-wp { letter-spacing: 0.26em; }
          `}</style>
          <p className="copyright-text-wp text-xs w-full text-center">
            <span className="copyright-ls-26-wp" style={{ color: TEAL }}>{data.bottom.copyright}</span>
            <span className="text-white copyright-ls-26-wp"> | </span>
            <span className="text-white copyright-ls-26-wp">{data.bottom.rights}</span>
            <span className="text-white copyright-ls-26-wp"> | </span>
            <FooterNavLink
              href={data.bottom.privacyUrl || '#'}
              className="copyright-ls-26-wp"
              style={{ color: getBottomLinkColor('privacy') }}
              onMouseEnter={() => setHoveredBottomLink('privacy')}
              onMouseLeave={() => setHoveredBottomLink('')}
            >
              {data.bottom.privacyLabel}
            </FooterNavLink>
            <span className="text-white copyright-ls-26-wp"> | </span>
            <FooterNavLink
              href={data.bottom.termsUrl || '#'}
              className="copyright-ls-26-wp"
              style={{ color: getBottomLinkColor('terms') }}
              onMouseEnter={() => setHoveredBottomLink('terms')}
              onMouseLeave={() => setHoveredBottomLink('')}
            >
              {data.bottom.termsLabel}
            </FooterNavLink>
            <span className="text-white copyright-ls-26-wp"> | </span>
            {creditExternalUrl ? (
              <a
                href={creditExternalUrl}
                className="copyright-ls-26-wp"
                style={{ color: getBottomLinkColor('credit') }}
                onMouseEnter={() => setHoveredBottomLink('credit')}
                onMouseLeave={() => setHoveredBottomLink('')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.bottom.credit}
              </a>
            ) : (
              <span className="copyright-ls-26-wp" style={{ color: TEAL }}>{data.bottom.credit}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
