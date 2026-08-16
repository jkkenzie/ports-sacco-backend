import { WP_CUSTOM_API } from '../api/wp';

const FALLBACK_FOOTER_DATA = {
  contact: {
    title: 'Branch Network',
    officeName: 'Mombasa - Head Office',
    officeAddress: 'Ports Sacco Plaza, Mwakilingo Road, off Moi Avenue, Mombasa',
    officeAddressUrl: '',
    phone: 'Tel: 0111 173 000',
    phoneUrl: '',
    poBox: 'P.O Box 95372 - 80100, Mombasa',
    email: 'info@portsacco.co.ke',
    emailUrl: '',
    tagline: 'UPLIFTING PEOPLE',
    iconColor: '#FFFFFF',
    linkHoverColor: '#22ACB6',
    logo: { id: 0, url: '', svg: '' },
    addressIcon: { id: 0, url: '', svg: '' },
    phoneIcon: { id: 0, url: '', svg: '' },
    poBoxIcon: { id: 0, url: '', svg: '' },
    emailIcon: { id: 0, url: '', svg: '' },
  },
  branches: [
    { name: 'Nairobi CBD Office', address: 'KCS House, 7th Floor, Mama Ngina Street', phone: 'Tel: 0111 173 138' },
    { name: 'Nairobi Branch', address: 'KPA-ICD Road, Off Mombasa Road', phone: 'Tel: 0111 173 138' },
    { name: 'Kisumu Office', address: "Tuff Foam Mall Ground Floor, Achieng' Oneko Road Opp. Reinsurance Plaza", phone: 'Tel: 0111 173 142' },
    { name: 'Voi Office', address: 'KPLC Street, Opposite Post Bank', phone: 'Tel: 0111 173 143' },
  ],
  socials: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
    iconColor: '#FFFFFF',
    iconHoverColor: '#22ACB6',
    youtubeInternalColor: '#FFFFFF',
    facebookIcon: { id: 0, url: '', svg: '' },
    twitterIcon: { id: 0, url: '', svg: '' },
    instagramIcon: { id: 0, url: '', svg: '' },
    linkedinIcon: { id: 0, url: '', svg: '' },
    youtubeIcon: { id: 0, url: '', svg: '' },
  },
  appLinks: {
    title: 'Download Mobile App',
    googlePlayUrl: '#',
    appStoreUrl: '#',
    iconColor: '#FFFFFF',
    iconHoverColor: '#22ACB6',
    iconWidth: 144,
    iconHeight: 48,
    googlePlayIcon: { id: 0, url: '', svg: '' },
    appStoreIcon: { id: 0, url: '', svg: '' },
  },
  hours: {
    title: 'Banking Hours',
    weekdaysLabel: 'Monday - Friday:',
    weekdaysTime: '08:30 AM - 04:00 PM',
    saturdayLabel: 'Saturday:',
    saturdayTime: '09:00 AM - 12:00 PM',
    sundayLabel: 'Sunday:',
    sundayTime: 'Closed',
  },
  bottom: {
    copyright: '© 2026 PORTS SACCO',
    rights: '- ALL RIGHTS RESERVED',
    privacyLabel: 'PRIVACY POLICY',
    privacyUrl: '#',
    termsLabel: 'TERMS AND CONDITIONS',
    termsUrl: '#',
    credit: 'A SMITH CREATIVE DESIGN',
    creditUrl: '',
    linkColor: '#22ACB6',
    linkHoverColor: '#FFFFFF',
  },
};

let footerCache = null;

function resolveWpHomeBaseUrl() {
  const raw = String(import.meta.env.VITE_WP_HOME || '').trim();
  const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';

  if (!raw) return origin;

  // Avoid mixed-content in HTTPS pages if env is accidentally http://...
  if (origin && origin.startsWith('https://') && raw.startsWith('http://')) {
    return origin;
  }

  return raw;
}

function normalizeFooterData(payload) {
  if (!payload || typeof payload !== 'object') {
    return FALLBACK_FOOTER_DATA;
  }

  return {
    contact: { ...FALLBACK_FOOTER_DATA.contact, ...(payload.contact || {}) },
    branches: Array.isArray(payload.branches) && payload.branches.length ? payload.branches : FALLBACK_FOOTER_DATA.branches,
    socials: { ...FALLBACK_FOOTER_DATA.socials, ...(payload.socials || {}) },
    appLinks: { ...FALLBACK_FOOTER_DATA.appLinks, ...(payload.appLinks || {}) },
    hours: { ...FALLBACK_FOOTER_DATA.hours, ...(payload.hours || {}) },
    bottom: { ...FALLBACK_FOOTER_DATA.bottom, ...(payload.bottom || {}) },
  };
}

export async function getFooterData() {
  if (footerCache) {
    return footerCache;
  }

  const base = resolveWpHomeBaseUrl();
  const endpoint = `${base.replace(/\/$/, '')}${WP_CUSTOM_API}/footer`;

  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      footerCache = FALLBACK_FOOTER_DATA;
      return footerCache;
    }

    const payload = await response.json();
    footerCache = normalizeFooterData(payload);
    return footerCache;
  } catch (error) {
    footerCache = FALLBACK_FOOTER_DATA;
    return footerCache;
  }
}

export { FALLBACK_FOOTER_DATA };
