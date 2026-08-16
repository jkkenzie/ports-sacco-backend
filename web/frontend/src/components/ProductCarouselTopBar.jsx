import React, { useId, useMemo } from 'react';

const CURVE_PATH =
  'M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z';

function gradientAngleToLine(angleDeg) {
  const deg = Number(angleDeg);
  const radians = ((Number.isFinite(deg) ? deg : 90) - 90) * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x1: String(0.5 - cos / 2),
    y1: String(0.5 - sin / 2),
    x2: String(0.5 + cos / 2),
    y2: String(0.5 + sin / 2),
  };
}

/** Full-width curved top bar for the loans carousel (matches OldDist production build). */
export function ProductCarouselTopBar({
  sectionBgColor = '#F5F4EE',
  topBarColor = '#ffffff',
  topBarGradientAngle = 90,
  topBarGradientFrom = '#ffffff',
  topBarGradientVia = '#ffffff',
  topBarGradientTo = '#ffffff',
}) {
  const reactId = useId().replace(/:/g, '');
  const clipId = `clip-loans-carousel-top-${reactId}`;
  const gradId = `loan-carousel-topbar-grad-${reactId}`;

  const hasGradientStops = useMemo(() => {
    const from = String(topBarGradientFrom || '').trim();
    const via = String(topBarGradientVia || '').trim();
    const to = String(topBarGradientTo || '').trim();
    return from !== '' && via !== '' && to !== '';
  }, [topBarGradientFrom, topBarGradientVia, topBarGradientTo]);

  const topBarBackground = hasGradientStops
    ? `linear-gradient(${Number(topBarGradientAngle) || 90}deg, ${topBarGradientFrom}, ${topBarGradientVia}, ${topBarGradientTo})`
    : topBarColor;

  const gradientLine = useMemo(
    () => gradientAngleToLine(topBarGradientAngle),
    [topBarGradientAngle]
  );

  const pathFill = hasGradientStops ? `url(#${gradId})` : topBarColor;

  return (
    <div
      className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen shrink-0 overflow-hidden"
      style={{ background: topBarBackground, minHeight: '37px' }}
    >
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
          <clipPath id={clipId}>
            <rect x="484.39" y="0" width="120" height="38.01" />
          </clipPath>
          {hasGradientStops ? (
            <linearGradient id={gradId} gradientUnits="objectBoundingBox" {...gradientLine}>
              <stop offset="0%" stopColor={topBarGradientFrom} />
              <stop offset="50%" stopColor={topBarGradientVia} />
              <stop offset="100%" stopColor={topBarGradientTo} />
            </linearGradient>
          ) : null}
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="422.93" width="240.31" height="38.01" style={{ fill: sectionBgColor }} />
          <path d={CURVE_PATH} style={{ fill: pathFill }} />
        </g>
      </svg>
    </div>
  );
}
