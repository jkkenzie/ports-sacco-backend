import { wpFetchInit, customApiUrl } from '../api/wp';

const FALLBACK_HEADER_DATA = {
  topbar: {
    enabled: false,
    bgColor: '#1BB5B5',
    bgOpacity: 100,
    textColor: '#ffffff',
    hoverColor: '#ee6e2a',
    fontSize: 10,
    menuLinkColor: '#ffffff',
    menuLinkHoverColor: '#ee6e2a',
    dropdownBgColor: 'rgba(255,255,255,0.92)',
    dropdownItemColor: '#4b5563',
    dropdownItemHoverColor: '#ee6e2a',
    links: [],
    locationItems: [],
    phoneText: '',
    phoneUrl: '',
    loginLabel: '',
    loginUrl: '',
  },
  main: {
    bgColor: '#ffffff',
    logoId: 0,
    logo: { id: 0, url: '', svg: '' },
  },
};

function normalizeHeaderData(payload) {
  if (!payload || typeof payload !== 'object') return FALLBACK_HEADER_DATA;
  const topbar = payload.topbar && typeof payload.topbar === 'object' ? payload.topbar : {};
  const main = payload.main && typeof payload.main === 'object' ? payload.main : {};
  return {
    topbar: {
      ...FALLBACK_HEADER_DATA.topbar,
      ...topbar,
      links: Array.isArray(topbar.links) && topbar.links.length ? topbar.links : FALLBACK_HEADER_DATA.topbar.links,
      locationItems:
        Array.isArray(topbar.locationItems) && topbar.locationItems.length ? topbar.locationItems : FALLBACK_HEADER_DATA.topbar.locationItems,
    },
    main: { ...FALLBACK_HEADER_DATA.main, ...main, logo: { ...FALLBACK_HEADER_DATA.main.logo, ...(main.logo || {}) } },
  };
}

export async function getHeaderData() {
  const endpoint = customApiUrl('/header');

  try {
    const response = await fetch(endpoint, wpFetchInit());
    if (!response.ok) {
      return FALLBACK_HEADER_DATA;
    }
    const payload = await response.json();
    return normalizeHeaderData(payload);
  } catch (err) {
    console.error('[getHeaderData] Failed', { endpoint, wpApiBase: wpApiBase(), err });
    return FALLBACK_HEADER_DATA;
  }
}

export { FALLBACK_HEADER_DATA };
