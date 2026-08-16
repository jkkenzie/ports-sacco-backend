import React from 'react';

const DEFAULT_COLOR = '#22acb6';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Page section heading — matches core/heading h1–h2 styling (e.g. "Who We Are").
 */
export function SectionPageTitle({
  children,
  anchor,
  color = DEFAULT_COLOR,
  as: Tag = 'h1',
  className = '',
  style = {},
}) {
  if (!children) {
    return null;
  }

  const text = typeof children === 'string' ? children : '';
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const id = explicitAnchor || (text ? slugifyId(text) : undefined);

  return (
    <Tag
      id={id}
      className={`max-w-full mx-auto text-2xl md:text-3xl font-bold mb-6 scroll-mt-[100px] px-[50px] pt-6 ${className}`.trim()}
      style={{
        color,
        fontFamily: 'Museo900-Regular, Museo, sans-serif',
        fontSize: '26px',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
