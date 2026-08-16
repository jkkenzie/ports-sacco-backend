import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AwardsIcon, MembersIcon, ProductsIcon } from '../components/StatsSection';

const FALLBACK_ICONS = [AwardsIcon, ProductsIcon, MembersIcon];

const DEFAULT_ITEMS = [
  {
    valueStart: 0,
    valueEnd: 15,
    showPlus: false,
    title: 'AWARDS IN 2025',
    subtitle: 'We are leading by example',
    iconId: 0,
    iconUrl: '',
    iconSvg: '',
  },
  {
    valueStart: 0,
    valueEnd: 26,
    showPlus: false,
    title: 'PRODUCTS OFFERED',
    subtitle: 'Products that fit your needs',
    iconId: 0,
    iconUrl: '',
    iconSvg: '',
  },
  {
    valueStart: 0,
    valueEnd: 10000,
    showPlus: true,
    title: 'REGISTERED MEMBERS',
    subtitle: 'A growing membership base.',
    iconId: 0,
    iconUrl: '',
    iconSvg: '',
  },
];

function clampInt(n, min, max) {
  const x = Math.round(Number(n));
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
}

function normalizeItems(raw) {
  const saved = Array.isArray(raw) ? raw : [];
  if (saved.length === 0) {
    return DEFAULT_ITEMS.map((row) => ({ ...row }));
  }
  return saved.map((row, i) => {
    const d = DEFAULT_ITEMS[i] || {
      valueStart: 0,
      valueEnd: 0,
      showPlus: false,
      title: '',
      subtitle: '',
      iconId: 0,
      iconUrl: '',
      iconSvg: '',
    };
    const s = row && typeof row === 'object' ? row : {};
    return {
      valueStart: clampInt(s.valueStart ?? d.valueStart, -999999999, 999999999),
      valueEnd: clampInt(s.valueEnd ?? d.valueEnd, -999999999, 999999999),
      showPlus: Boolean(s.showPlus ?? d.showPlus),
      title: String(s.title ?? d.title ?? '').trim() || d.title,
      subtitle: String(s.subtitle ?? d.subtitle ?? '').trim() || d.subtitle,
      iconId: Number(s.iconId) || 0,
      iconUrl: typeof s.iconUrl === 'string' ? s.iconUrl : d.iconUrl || '',
      iconSvg: typeof s.iconSvg === 'string' ? s.iconSvg : d.iconSvg || '',
    };
  });
}

function formatDisplayValue(n, showPlus) {
  const base = Number(n).toLocaleString('en-US');
  return showPlus ? `${base}+` : base;
}

function InlineSvgMarkup({ markup }) {
  if (typeof markup !== 'string' || !markup.includes('<svg')) {
    return null;
  }
  const normalizedMarkup = markup.includes('fill=') ? markup : markup.replace('<svg', '<svg fill="currentColor"');
  return (
    <span
      aria-hidden
      className="block h-full w-auto"
      // eslint-disable-next-line react/no-danger -- CMS-controlled SVG
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
      return <img src={url} alt="" aria-hidden className="h-full w-auto object-contain" />;
    }
    return null;
  }

  return (
    <span
      aria-hidden
      className="block h-full w-auto"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

function StatIcon({ item, width, height, color, fallbackIndex = 0 }) {
  const style = {
    width: width === 0 ? 'auto' : `${width}px`,
    height: height === 0 ? 'auto' : `${height}px`,
    color,
  };

  if (item.iconSvg) {
    return (
      <div className="home-stat-icon mb-1 flex min-h-0 min-w-0 items-center justify-start overflow-hidden" style={style}>
        <InlineSvgMarkup markup={item.iconSvg} />
      </div>
    );
  }
  if (item.iconUrl) {
    return (
      <div className="home-stat-icon mb-1 flex min-h-0 min-w-0 items-center justify-start overflow-hidden" style={style}>
        {isSvgUrl(item.iconUrl) ? (
          <InlineSvgIcon url={item.iconUrl} />
        ) : (
          <img src={item.iconUrl} alt="" aria-hidden className="h-full w-auto object-contain" />
        )}
      </div>
    );
  }
  const Fallback = FALLBACK_ICONS[fallbackIndex % FALLBACK_ICONS.length];
  return (
    <div className="home-stat-icon mb-1 flex min-h-0 min-w-0 items-center justify-start overflow-hidden" style={style}>
      <Fallback />
    </div>
  );
}

/**
 * Home stats strip (Gutenberg: custom/home-stats). Counters run once when the section enters the viewport.
 */
export function HomeStatsBlock({
  sectionId,
  anchor,
  items,
  animationDurationSec,
  sectionBg,
  numberColor,
  titleColor,
  subtitleColor,
  iconColor,
  iconWidth,
  iconHeight,
}) {
  const explicit = typeof anchor === 'string' ? anchor.trim() : '';
  const sid = typeof sectionId === 'string' && sectionId.trim() ? sectionId.trim() : 'stats';
  const domId = explicit || sid;

  const rows = useMemo(() => normalizeItems(items), [items]);
  const durationSec = Math.max(0.4, Math.min(30, Number(animationDurationSec) || 2.5));
  const durationMs = durationSec * 1000;

  const bg = typeof sectionBg === 'string' && sectionBg.trim() ? sectionBg : '#22acb6';
  const numC = typeof numberColor === 'string' && numberColor.trim() ? numberColor : '#ffffff';
  const titC = typeof titleColor === 'string' && titleColor.trim() ? titleColor : '#ffffff';
  const subC = typeof subtitleColor === 'string' && subtitleColor.trim() ? subtitleColor : '#ffffff';
  const icoC = typeof iconColor === 'string' && iconColor.trim() ? iconColor : '#ffffff';

  const w = Number.isFinite(Number(iconWidth)) && Number(iconWidth) >= 0 ? Number(iconWidth) : 107;
  const h = Number.isFinite(Number(iconHeight)) && Number(iconHeight) >= 0 ? Number(iconHeight) : 58;

  const blockRef = useRef(null);
  const rowsKey = useMemo(() => JSON.stringify(rows.map((r) => [r.valueStart, r.valueEnd, r.showPlus])), [rows]);

  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValues, setDisplayValues] = useState(() =>
    rows.map((r) => formatDisplayValue(r.valueStart, r.showPlus))
  );

  useEffect(() => {
    setDisplayValues(rows.map((r) => formatDisplayValue(r.valueStart, r.showPlus)));
    setHasAnimated(false);
  }, [rowsKey, rows]);

  useEffect(() => {
    const node = blockRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hasAnimated) return undefined;

    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplayValues(
        rows.map((row) => {
          const a = row.valueStart;
          const b = row.valueEnd;
          const v = Math.round(a + (b - a) * eased);
          return formatDisplayValue(v, row.showPlus);
        })
      );
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplayValues(rows.map((row) => formatDisplayValue(row.valueEnd, row.showPlus)));
        setHasAnimated(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isInView, hasAnimated, rows, durationMs]);

  return (
    <div
      ref={blockRef}
      id={domId}
      className="relative overflow-visible py-12 px-[50px] pb-15 text-white"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: bg }}
    >
      <style>{`
        .home-stats-section .home-stat-icon svg { width: auto; height: 100%; min-width: 0; min-height: 0; }
        .home-stats-section .home-stat-icon svg,
        .home-stats-section .home-stat-icon svg path,
        .home-stats-section .home-stat-icon svg g { fill: currentColor; }
      `}</style>
      <div className="home-stats-section mx-auto max-w-7xl px-[15px]">
        <div className="grid grid-cols-1 gap-6 max-[479px]:justify-items-center min-[480px]:grid-cols-3 min-[678px]:gap-8">
          {rows.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex max-[480px]:gap-1 flex-col gap-6 lg:flex-row lg:items-start"
            >
              <div
                className="min-[768px]:text-[48px] text-[34px]"
                style={{ fontFamily: 'Museo, sans-serif', fontWeight: 900, lineHeight: '61px', color: numC }}
              >
                {displayValues[index] ?? formatDisplayValue(item.valueEnd, item.showPlus)}
              </div>
              <div className="flex-1">
                <div style={{ maxWidth: '108px' }}>
                  <StatIcon item={item} width={w} height={h} color={icoC} fallbackIndex={index} />
                </div>
                <div
                  className="mb-1 text-xs font-bold leading-[14px]"
                  style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: titC }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <div
                  className="text-[10px] leading-[12px]"
                  style={{ fontFamily: 'Museo, sans-serif', fontWeight: 100, color: subC }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: item.subtitle }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const HOME_STATS_DEFAULT_PROPS = {
  sectionId: 'stats',
  animationDurationSec: 2.5,
  sectionBg: '#22acb6',
  numberColor: '#ffffff',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  iconColor: '#ffffff',
  iconWidth: 107,
  iconHeight: 58,
  items: DEFAULT_ITEMS.map((r) => ({ ...r })),
};
