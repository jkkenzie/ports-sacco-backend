import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, Phone, User } from 'lucide-react';
import { menuHref, menuLinkRel, menuRouterPath, opensInNewTab, shouldUseNativeAnchor } from '../utils/menuLink';

function withOpacity(color, opacityPercent) {
  const colorValue = String(color || '').trim();
  const alpha = Math.max(0, Math.min(100, Number(opacityPercent || 100))) / 100;
  if (!colorValue) {
    return `rgba(27, 181, 181, ${alpha})`;
  }

  const hexMatch = colorValue.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    var hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbMatch = colorValue.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((x) => x.trim());
    if (parts.length >= 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    }
  }

  return colorValue;
}

function NavTarget({ href, className, style, children, ...rest }) {
  const url = String(href || '').trim();
  if (!url || url === '#') {
    return (
      <span className={className} style={{ cursor: 'pointer', ...style }} {...rest}>
        {children}
      </span>
    );
  }

  if (shouldUseNativeAnchor(url)) {
    return (
      <a href={menuHref(url)} className={className} style={{ cursor: 'pointer', ...style }} rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={menuRouterPath(url)} className={className} style={{ cursor: 'pointer', ...style }} {...rest}>
      {children}
    </Link>
  );
}

function MenuTarget({ url, target, className, style, children, ...rest }) {
  if (!url || url === '#') {
    return (
      <span className={className} style={style} {...rest}>
        {children}
      </span>
    );
  }

  const rel = menuLinkRel(target);
  const newTab = opensInNewTab(target);

  if (shouldUseNativeAnchor(url, target)) {
    return (
      <a href={menuHref(url)} className={className} style={style} {...(newTab ? { target: '_blank', rel } : {})} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={menuRouterPath(url)} className={className} style={style} {...rest}>
      {children}
    </Link>
  );
}

function DropdownMenuTarget({ url, target, itemColor, hoverColor, className, style, children, ...rest }) {
  const baseStyle = {
    color: itemColor,
    fontFamily: 'Gotham Rounded, sans-serif',
    fontWeight: 700,
    fontSize: '10px',
    ...style,
  };

  const hoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.color = hoverColor;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.color = itemColor;
    },
  };

  if (!url) {
    return (
      <span className={className} style={baseStyle} {...hoverHandlers} {...rest}>
        {children}
      </span>
    );
  }

  const rel = menuLinkRel(target);
  const newTab = opensInNewTab(target);
  const linkProps = { className, style: baseStyle, ...hoverHandlers, ...rest };

  if (shouldUseNativeAnchor(url, target)) {
    return (
      <a href={menuHref(url)} {...linkProps} {...(newTab ? { target: '_blank', rel } : {})}>
        {children}
      </a>
    );
  }

  return (
    <Link to={menuRouterPath(url)} {...linkProps}>
      {children}
    </Link>
  );
}

export function TopBar({
  bgColor = '#1BB5B5',
  bgOpacity = 100,
  textColor = '#ffffff',
  hoverColor = '#ee6e2a',
  fontSize = 10,
  menuLinkColor = '#ffffff',
  menuLinkHoverColor = '#ee6e2a',
  dropdownBgColor = 'rgba(255,255,255,0.92)',
  dropdownItemColor = '#4b5563',
  dropdownItemHoverColor = '#ee6e2a',
  locationItems = [],
  phoneText = '',
  phoneUrl = '',
  loginLabel = '',
  loginUrl = '',
  loginMenuItems = [],
}) {
  const [openLoginMenuIndex, setOpenLoginMenuIndex] = useState(null);
  const resolvedTopbarBg = withOpacity(bgColor, bgOpacity);
  const resolvedFontSize = Number.isFinite(Number(fontSize)) ? `${Number(fontSize)}px` : '10px';
  const resolvedTextColor = textColor || '#ffffff';
  const resolvedHoverColor = hoverColor || '#ee6e2a';
  const resolvedMenuLinkColor = menuLinkColor || resolvedTextColor;
  const resolvedMenuLinkHoverColor = menuLinkHoverColor || resolvedHoverColor;
  const resolvedDropdownBg = dropdownBgColor || 'rgba(255, 255, 255, 0.92)';
  const resolvedDropdownItemColor = dropdownItemColor || '#4b5563';
  const resolvedDropdownItemHoverColor = dropdownItemHoverColor || '#ee6e2a';

  const topBarTextStyle = { color: resolvedTextColor };
  const menuParentStyle = { color: resolvedMenuLinkColor };
  const safeLocations = Array.isArray(locationItems) && locationItems.length
    ? locationItems
        .map((x) => {
          const rawUrl = String(x?.url || '').trim();
          return { label: String(x?.label || '').trim(), url: rawUrl === '#' ? '' : rawUrl };
        })
        .filter((x) => x.label)
    : [
        { label: 'MOMBASA', url: '#' },
        { label: 'VOI', url: '#' },
        { label: 'NAIROBI', url: '#' },
        { label: 'KILUMU', url: '#' },
      ];

  const loginMenuRoots = useMemo(() => {
    return Array.isArray(loginMenuItems)
      ? loginMenuItems
          .filter((x) => x && typeof x === 'object')
          .map((x) => ({
            label: String(x?.label || '').trim(),
            url: (() => {
              const rawUrl = String(x?.url || '').trim();
              return rawUrl === '#' ? '' : rawUrl;
            })(),
            target: String(x?.target || '').trim(),
            children: Array.isArray(x?.children)
              ? x.children
                  .filter((c) => c && typeof c === 'object')
                  .map((c) => ({
                    label: String(c?.label || '').trim(),
                    url: (() => {
                      const rawUrl = String(c?.url || '').trim();
                      return rawUrl === '#' ? '' : rawUrl;
                    })(),
                    target: String(c?.target || '').trim(),
                  }))
                  .filter((c) => c.label)
              : [],
          }))
          .filter((x) => x.label)
      : [];
  }, [loginMenuItems]);

  return (
    <div
      id="top-bar"
      className="py-2 px-4 relative z-[80]"
      style={{ backgroundColor: resolvedTopbarBg, fontFamily: 'Gotham Rounded, sans-serif', fontWeight: 900, fontSize: resolvedFontSize }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between" style={topBarTextStyle}>
        <div className="hidden md:flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>VISIT US:</span>
          <div className="flex items-center gap-1">
            {safeLocations.map((l, idx) => (
              <React.Fragment key={`${l.label}-${idx}`}>
                {idx > 0 ? <span>|</span> : null}
                <NavTarget
                  href={l.url}
                  className="transition-colors"
                  style={topBarTextStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = resolvedHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = resolvedTextColor)}
                >
                  {l.label}
                </NavTarget>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          {phoneUrl ? (
            <a
              href={phoneUrl}
              className="transition-colors"
              style={{ cursor: 'pointer', ...topBarTextStyle }}
              onMouseEnter={(e) => (e.currentTarget.style.color = resolvedHoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = resolvedTextColor)}
            >
              {phoneText}
            </a>
          ) : (
            <span>{phoneText}</span>
          )}
        </div>
        
        {loginMenuRoots.length ? (
          <div className="flex items-center gap-3">
            {loginMenuRoots.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="relative"
                onMouseEnter={() => setOpenLoginMenuIndex(idx)}
                onMouseLeave={() => setOpenLoginMenuIndex(null)}
              >
                <MenuTarget
                  url={item.url}
                  target={item.target}
                  className="flex items-center gap-1 transition-colors"
                  style={menuParentStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = resolvedMenuLinkHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = resolvedMenuLinkColor)}
                  onClick={(e) => {
                    if (!item.url) {
                      e.preventDefault();
                    }
                  }}
                  aria-label={item.label}
                >
                  {idx === 0 ? <User className="w-4 h-4" style={{ color: 'currentColor' }} /> : null}
                  <span>{item.label}</span>
                  {item.children.length > 0 ? <ChevronDown className="w-3.5 h-3.5" style={{ color: 'currentColor' }} /> : null}
                </MenuTarget>
                {openLoginMenuIndex === idx && item.children.length > 0 ? (
                  <div
                    className="absolute top-full right-0 z-[90]"
                    onMouseEnter={() => setOpenLoginMenuIndex(idx)}
                    onMouseLeave={() => setOpenLoginMenuIndex(null)}
                  >
                    <div
                      className="top-bar-dropdown-menu py-1 min-w-[200px] rounded-md overflow-hidden"
                      style={{
                        backgroundColor: resolvedDropdownBg,
                        color: resolvedDropdownItemColor,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      {item.children.map((child, childIdx) => (
                        <DropdownMenuTarget
                          key={`${child.label}-${child.url}`}
                          url={child.url}
                          target={child.target}
                          itemColor={resolvedDropdownItemColor}
                          hoverColor={resolvedDropdownItemHoverColor}
                          className="block px-3 py-1.5 transition-colors"
                          style={{
                            borderBottom: childIdx < item.children.length - 1 ? '1px solid #d1d5db' : 'none',
                          }}
                          onClick={(e) => {
                            if (!child.url) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {child.label}
                        </DropdownMenuTarget>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <NavTarget
            href={loginUrl || '#'}
            className="flex items-center gap-1 transition-colors"
            style={menuParentStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = resolvedMenuLinkHoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = resolvedMenuLinkColor)}
            aria-label={loginLabel}
          >
            <User className="w-4 h-4" style={{ color: 'currentColor' }} />
            <span>{loginLabel}</span>
          </NavTarget>
        )}
      </div>
    </div>
  );
}
