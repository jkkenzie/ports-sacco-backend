import React, { useCallback, useId, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

function normalizeLinkItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((x) => ({
      label: String(x?.label ?? '').trim(),
      url: String(x?.url ?? '').trim() || '#',
    }))
    .filter((x) => x.label !== '');
}

const DEFAULT_DROPDOWN_ITEMS = [
  { label: 'Savings & Investments', url: '/savings-products' },
  { label: 'Loan Products', url: '/loan-products' },
  { label: 'Financial Services', url: '/services' },
];

const DEFAULT_PRODUCT_PILLS = [
  { label: 'LOAN PRODUCTS', url: '/loan-products' },
  { label: 'SAVINGS PRODUCTS', url: '/savings-products' },
  { label: 'INVESTMENT OPTIONS', url: '/savings-products' },
  { label: 'ASSET FINANCE', url: '/loan-products/asset-finance' },
  { label: 'LPG FINANCING', url: '/services' },
  { label: 'CHEQUE CLEARANCE', url: '/services' },
  { label: 'SALARY PROCESSING', url: '/services' },
  { label: 'TILL NUMBER FOR BUSINESS', url: '/services' },
  { label: 'MOBILE & INTERNET BANKING', url: '/services' },
  { label: 'SCHOOL FEES COLLECTION ACCOUNT', url: '/savings-products' },
  { label: 'STANDING ORDERS', url: '/services' },
  { label: 'INSURANCE', url: '/services' },
  { label: 'FINANCIAL ADVICE', url: '/services' },
  { label: 'VISA ATM', url: '/services' },
];

function NavLink({ href, className, style, children, ...rest }) {
  const to = String(href || '').trim();
  if (to.startsWith('/')) {
    return (
      <Link to={to} className={className} style={style} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to || '#'} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}

export function ProductServicesBlock({
  sectionId = 'services',
  anchor,
  gradientAngle = 90,
  gradientFrom = '#00B2E0',
  gradientVia = '#00AFBB',
  gradientTo = '#00AB81',
  topBarBg = '#F5F4EE',
  topCurveRectFill = '#00AFBB',
  topCurvePathFill = '#F5F4EE',
  kickerText = 'YOUR JOURNEY OF PROSPERITY START HERE!',
  kickerColor = '#ffffff',
  centerPillText = 'HOW CAN WE UPLIFT YOU TODAY?',
  centerPillBg = '#EE6E2A',
  centerPillHoverBg = '#d96525',
  centerPillTextColor = '#ffffff',
  scrollArrowOuterFill = '#ffffff',
  scrollArrowInnerFill = '#22ACB6',
  boxBg = '#ffffff',
  boxTitle = 'PRODUCTS & SERVICES THAT UPLIFT YOUR FINANCIAL SUCCESS!',
  boxSubtitle = 'SELECT THE PRODUCT OR SERVICE YOU NEED',
  boxTitleColor = '#3b4e6b',
  boxSubtitleColor = '#3b4e6b',
  dropdownPlaceholder = 'How can we uplift you today?',
  dropdownItems = [],
  dropdownBg = '#38f0ba',
  dropdownBorderColor = '#e8e8e8',
  dropdownTextColor = '#3b4e6b',
  dropdownChevronColor = '#3b4e6b',
  goButtonBg = '#38f0ba',
  goButtonBorderColor = '#e8e8e8',
  goButtonIconColor = '#3b4e6b',
  goButtonHoverOpacity = 0.85,
  dividerColor = '#e8e8e8',
  productButtons = [],
  pillBg = '#00ada0',
  pillBorderColor = '#e8e8e8',
  pillTextColor = '#ffffff',
  pillHoverBg = '#ee6e2a',
  pillHoverBorderColor = '#ee6e2a',
  pillHoverTextColor = '#ffffff',
}) {
  const navigate = useNavigate();
  const clipId = useId().replace(/:/g, '');
  const clipServicesId = `clip-product-services-${clipId}`;
  const scrollClipId = `clip0_ps_scroll_${clipId}`;

  const [selectedDropdownIdx, setSelectedDropdownIdx] = useState(-1);
  const [hoverPill, setHoverPill] = useState(-1);
  const [centerHover, setCenterHover] = useState(false);
  const [goBtnHover, setGoBtnHover] = useState(false);

  const dropdownOptions = useMemo(() => {
    const n = normalizeLinkItems(dropdownItems);
    return n.length ? n : DEFAULT_DROPDOWN_ITEMS;
  }, [dropdownItems]);
  const pills = useMemo(() => {
    const n = normalizeLinkItems(productButtons);
    return n.length ? n : DEFAULT_PRODUCT_PILLS;
  }, [productButtons]);

  const gradientCss = useMemo(
    () => `linear-gradient(${Number(gradientAngle) || 90}deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
    [gradientAngle, gradientFrom, gradientVia, gradientTo]
  );

  const goHref = useCallback(
    (href) => {
      const h = String(href || '').trim();
      if (!h || h === '#') return;
      if (h.startsWith('/')) navigate(h);
      else window.location.assign(h);
    },
    [navigate]
  );

  const goDropdown = useCallback(() => {
    if (selectedDropdownIdx < 0) return;
    const opt = dropdownOptions[selectedDropdownIdx];
    if (opt?.url) goHref(opt.url);
  }, [dropdownOptions, selectedDropdownIdx, goHref]);

  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const sectionDomId = explicitAnchor || sectionId || 'services';

  const selectValue = selectedDropdownIdx < 0 ? '' : String(selectedDropdownIdx);

  return (
    <div
      id={sectionDomId}
      className="relative overflow-visible pt-0 pb-28 text-white"
      style={{ background: gradientCss, fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
      <div className="relative w-full shrink-0 overflow-hidden" style={{ backgroundColor: topBarBg, minHeight: '37px' }}>
        <svg
          viewBox="0 0 1088.78 38.01"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-1/2 h-auto"
          style={{
            display: 'block',
            minWidth: '1089px',
            width: '1089px',
            transform: 'translateX(-50%)',
          }}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <clipPath id={clipServicesId}>
              <rect x="484.39" y="0" width="120" height="38.01" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipServicesId})`}>
            <rect x="422.93" width="240.31" height="38.01" style={{ fill: topCurveRectFill }} />
            <path
              d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
              style={{ fill: topCurvePathFill }}
            />
          </g>
        </svg>
      </div>

      <div className="-mt-7 mb-0 flex justify-center">
        <button
          type="button"
          onClick={scrollToNearestSection}
          className="hover:opacity-80 relative z-10 cursor-pointer p-4 transition-opacity"
          style={{ animation: 'float 3s ease-in-out infinite' }}
          aria-label="Scroll section to top"
        >
          <svg className="block h-14 w-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath={`url(#${scrollClipId})`}>
              <path d={svgPaths.p1076300} fill={scrollArrowOuterFill} />
              <path d={svgPaths.p27278800} fill={scrollArrowInnerFill} />
            </g>
            <defs>
              <clipPath id={scrollClipId}>
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="relative mb-2 text-center lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <p
              className="uppercase"
              style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px', color: kickerColor }}
            >
              {kickerText}
            </p>
            <button
              type="button"
              className="whitespace-nowrap rounded-full px-6 text-xs font-medium transition-colors"
              style={{
                fontFamily: 'Sans-serif, Helvetica, sans-serif',
                minHeight: '36px',
                backgroundColor: centerHover ? centerPillHoverBg : centerPillBg,
                color: centerPillTextColor,
              }}
              onMouseEnter={() => setCenterHover(true)}
              onMouseLeave={() => setCenterHover(false)}
            >
              {centerPillText}
            </button>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <p
              className="uppercase"
              style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px', color: kickerColor }}
            >
              {kickerText}
            </p>
            <button
              type="button"
              className="justify-self-center whitespace-nowrap rounded-full px-6 text-xs font-medium transition-colors"
              style={{
                fontFamily: 'Sans-serif, Helvetica, sans-serif',
                minHeight: '36px',
                backgroundColor: centerHover ? centerPillHoverBg : centerPillBg,
                color: centerPillTextColor,
              }}
              onMouseEnter={() => setCenterHover(true)}
              onMouseLeave={() => setCenterHover(false)}
            >
              {centerPillText}
            </button>
            <div />
          </div>
        </div>

        <div className="mt-12 rounded-3xl p-8 sm:p-12" style={{ backgroundColor: boxBg }}>
          <h2
            className="mb-2 text-[21px]"
            style={{ fontFamily: 'Museo, sans-serif', fontWeight: 900, color: boxTitleColor }}
          >
            {boxTitle}
          </h2>
          <p className="mb-8 text-sm" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: boxSubtitleColor }}>
            {boxSubtitle}
          </p>

          <div className="mb-8 flex items-center gap-[1px]">
            <div className="relative flex-1">
              <select
                className="w-full cursor-pointer appearance-none rounded-full border px-4 py-3 text-[12px] font-bold"
                style={{
                  fontFamily: 'Sans-serif, Helvetica, sans-serif',
                  fontWeight: 900,
                  paddingRight: '38px',
                  backgroundColor: dropdownBg,
                  borderColor: dropdownBorderColor,
                  color: dropdownTextColor,
                }}
                value={selectValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedDropdownIdx(v === '' ? -1 : parseInt(v, 10));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    goDropdown();
                  }
                }}
                aria-label={dropdownPlaceholder}
              >
                <option value="">{dropdownPlaceholder}</option>
                {dropdownOptions.map((o, i) => (
                  <option key={`${o.label}-${i}`} value={String(i)}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 w-4 -translate-y-1/2"
                style={{ right: '16px', color: dropdownChevronColor }}
                strokeWidth={3}
                aria-hidden
              />
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity"
              style={{
                backgroundColor: goButtonBg,
                borderColor: goButtonBorderColor,
                opacity: goBtnHover ? goButtonHoverOpacity : 1,
              }}
              onClick={goDropdown}
              onMouseEnter={() => setGoBtnHover(true)}
              onMouseLeave={() => setGoBtnHover(false)}
              aria-label="Go to selected destination"
            >
              <ArrowRight className="h-4 w-4" style={{ color: goButtonIconColor }} strokeWidth={3} />
            </button>
          </div>

          <div style={{ height: '2px', backgroundColor: dividerColor, marginTop: '12px', marginBottom: '12px' }} />

          <div className="flex flex-wrap gap-3">
            {pills.map((item, idx) => {
              const isHover = hoverPill === idx;
              return (
                <NavLink
                  key={`${item.label}-${idx}`}
                  href={item.url}
                  className="flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm transition-colors"
                  style={{
                    fontFamily: 'Sans-serif, Helvetica, sans-serif',
                    backgroundColor: isHover ? pillHoverBg : pillBg,
                    borderColor: isHover ? pillHoverBorderColor : pillBorderColor,
                    color: isHover ? pillHoverTextColor : pillTextColor,
                  }}
                  onMouseEnter={() => setHoverPill(idx)}
                  onMouseLeave={() => setHoverPill(-1)}
                >
                  {item.label}
                  <ArrowRight className="size-4 shrink-0" />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
