import React from 'react';

const CURVE_PATH =
  'M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z';

/**
 * Top curve bar — fixed 1089px centered (matches ProductServicesBlock; does not stretch on resize).
 */
export function SectionTopCurveBar({
  clipId,
  barBg = '#F5F4EE',
  accentColor = '#00AFBB',
  pathFill,
}) {
  const pathColor = pathFill ?? barBg;

  return (
    <div
      className="relative w-full shrink-0 overflow-hidden"
      style={{ backgroundColor: barBg, minHeight: '37px' }}
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
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="422.93" width="240.31" height="38.01" fill={accentColor} />
          <path d={CURVE_PATH} fill={pathColor} />
        </g>
      </svg>
    </div>
  );
}
