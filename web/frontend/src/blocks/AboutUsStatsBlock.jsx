import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AwardsIcon,
  ProductsIcon,
  MembersIcon,
} from '../components/StatsSection';

const TEAL = '#40C9BF';
const ORANGE = '#EE6E2A';

const ICONS = [AwardsIcon, ProductsIcon, MembersIcon];

const DEFAULT_ITEMS = [
  { number: '15', title: 'AWARDS IN 2025', subtitle: 'We are leading by example', iconUrl: '', iconSvg: '' },
  { number: '26', title: 'PRODUCTS OFFERED', subtitle: 'Products that fit your needs', iconUrl: '', iconSvg: '' },
  { number: '10,000+', title: 'REGISTERED MEMBERS', subtitle: 'A growing membership base.', iconUrl: '', iconSvg: '' },
];

function normalizeItems(items) {
  const saved = Array.isArray(items) ? items : [];
  const count = Math.max(DEFAULT_ITEMS.length, saved.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = DEFAULT_ITEMS[i] || { number: '', title: '', subtitle: '', iconUrl: '', iconSvg: '' };
    const s = saved[i] && typeof saved[i] === 'object' ? saved[i] : {};
    const number = String(s.number ?? '').trim();
    const title = String(s.title ?? '').trim();
    const subtitle = String(s.subtitle ?? '').trim();
    out.push({
      number: number || d.number,
      title: title || d.title,
      subtitle: subtitle || d.subtitle,
      iconUrl: typeof s.iconUrl === 'string' ? s.iconUrl : d.iconUrl,
      iconSvg: typeof s.iconSvg === 'string' ? s.iconSvg : d.iconSvg,
    });
  }
  return out;
}

function InlineSvgMarkup({ markup }) {
  if (typeof markup !== 'string' || !markup.includes('<svg')) {
    return null;
  }
  const normalizedMarkup = markup.includes('fill=') ? markup : markup.replace('<svg', '<svg fill="currentColor"');
  return (
    <span
      aria-hidden
      className="w-auto h-full block"
      // Source is controlled media uploaded in WP admin.
      dangerouslySetInnerHTML={{ __html: normalizedMarkup }}
    />
  );
}

function isSvgUrl(url) {
  if (typeof url !== 'string' || !url) return false;
  const clean = url.split('?')[0].split('#')[0];
  return clean.toLowerCase().endsWith('.svg');
}

function InlineSvgIcon({ url }) {
  const [svgMarkup, setSvgMarkup] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!url || !isSvgUrl(url)) {
      setSvgMarkup('');
      setFailed(false);
      return () => {};
    }

    setFailed(false);
    fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then((txt) => {
        if (cancelled) return;
        if (typeof txt === 'string' && txt.includes('<svg')) {
          setSvgMarkup(txt.includes('fill=') ? txt : txt.replace('<svg', '<svg fill="currentColor"'));
          setFailed(false);
        } else {
          setSvgMarkup('');
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSvgMarkup('');
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!svgMarkup) {
    if (failed) {
      return (
        <img
          src={url}
          alt=""
          aria-hidden
          className="w-auto h-full object-contain"
        />
      );
    }
    return null;
  }

  return (
    <span
      aria-hidden
      className="w-auto h-full block"
      // Source is controlled media uploaded in WP admin.
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

function parseTargetNumber(numStr) {
  if (numStr == null) return null;
  const cleaned = String(numStr).replace(/<[^>]*>/g, '').replace(/,/g, '').replace(/\+/g, '').trim();
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

function formatNumber(num, originalStr) {
  const base = Number(num).toLocaleString('en-US');
  return String(originalStr).includes('+') ? `${base}+` : base;
}

export function AboutUsStatsBlock({ items, iconWidth = 107, iconHeight = 58, iconColor = TEAL }) {
  const rows = useMemo(() => normalizeItems(items), [items]);
  const w = Number.isFinite(Number(iconWidth)) && Number(iconWidth) >= 0 ? Number(iconWidth) : 107;
  const h = Number.isFinite(Number(iconHeight)) && Number(iconHeight) >= 0 ? Number(iconHeight) : 58;
  const c = typeof iconColor === 'string' && iconColor.trim() ? iconColor : TEAL;
  const blockRef = useRef(null);
  const numbersKey = useMemo(() => JSON.stringify(rows.map((row) => row.number)), [rows]);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState(() =>
    rows.map((row) => {
      const target = parseTargetNumber(row.number);
      return target == null ? row.number : formatNumber(0, row.number);
    })
  );

  useEffect(() => {
    setDisplayNumbers(
      rows.map((row) => {
        const target = parseTargetNumber(row.number);
        return target == null ? row.number : formatNumber(0, row.number);
      })
    );
    setHasAnimated(false);
  }, [numbersKey, rows]);

  useEffect(() => {
    const node = blockRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hasAnimated) return undefined;
    const start = performance.now();
    const durationMs = 2500;
    const targets = rows.map((row) => parseTargetNumber(row.number));
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNumbers(
        rows.map((row, idx) => {
          const target = targets[idx];
          if (target == null) return row.number;
          return formatNumber(Math.floor(target * eased), row.number);
        })
      );
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplayNumbers(rows.map((row) => row.number));
        setHasAnimated(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isInView, hasAnimated, rows]);

  return (
    <div
      ref={blockRef}
      className="w-full about-us-stats-section"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        animation: 'fadeInUp 0.8s ease-out',
        willChange: 'transform, opacity',
        scrollMarginTop: '100px',
      }}
    >
      <style>{`
        .about-us-stats-section .about-us-stat-icon {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .about-us-stats-section .about-us-stat-icon svg {
          width: auto;
          height: 100%;
          min-width: 0;
          min-height: 0;
        }
        .about-us-stats-section .about-us-stat-icon svg,
        .about-us-stats-section .about-us-stat-icon svg path,
        .about-us-stats-section .about-us-stat-icon svg g,
        .about-us-stats-section .about-us-stat-icon svg polygon,
        .about-us-stats-section .about-us-stat-icon svg circle,
        .about-us-stats-section .about-us-stat-icon svg rect {
          fill: currentColor;
        }
      `}</style>
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-8 lg:gap-10">
        {rows.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div
                className="flex flex-row items-end justify-start gap-3 mb-3"
                style={{ color: TEAL }}
              >
                <span
                  className="text-[34px] min-[768px]:text-[48px]"
                  style={{ fontFamily: 'Museo, sans-serif', fontWeight: 900, lineHeight: 0.8 }}
                >
                  {displayNumbers[index] ?? item.number}
                </span>
                <div
                  className="flex-shrink-0 about-us-stat-icon min-w-0 min-h-0"
                  style={{ width: w === 0 ? 'auto' : `${w}px`, height: h === 0 ? 'auto' : `${h}px`, color: c }}
                >
                  {item.iconSvg ? (
                    <InlineSvgMarkup markup={item.iconSvg} />
                  ) : item.iconUrl ? (
                    isSvgUrl(item.iconUrl) ? (
                      <InlineSvgIcon url={item.iconUrl} />
                    ) : (
                      <img
                        src={item.iconUrl}
                        alt=""
                        aria-hidden
                        className="w-auto h-full object-contain"
                      />
                    )
                  ) : (
                    <Icon />
                  )}
                </div>
              </div>
              <div
                className="font-bold text-xs leading-tight mb-1"
                style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: TEAL }}
              >
                {item.title}
              </div>
              <div
                className="text-[10px] leading-tight"
                style={{ fontFamily: 'Museo, sans-serif', fontWeight: 100, color: ORANGE }}
              >
                {item.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
