import React from 'react';
import { SectionPageTitle } from '../components/SectionPageTitle';
import { blockSpacingStyle } from '../utils/blockSpacing';

/** Matches AboutUsWhoWeAreSection.jsx */
const TEAL = '#22acb6';
const BODY_COLOR = '#333333';

export function decodeHtmlEntities(text) {
  if (typeof text !== 'string' || !text) {
    return text;
  }
  if (typeof document === 'undefined') {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CoreParagraphBlock(props) {
  const { content } = props;
  if (!content) {
    return null;
  }
  const text = decodeHtmlEntities(content);
  const spacingStyle = blockSpacingStyle(props);
  return (
    <p
      className="max-w-full mx-auto pb-11 text-sm md:text-base px-[50px]"
      style={{
        color: BODY_COLOR,
        lineHeight: 1.6,
        fontFamily: 'sans-serif, Helvetica, sans-serif',
        ...spacingStyle,
      }}
    >
      {text}
    </p>
  );
}

/** Matches list styling in AboutUsWhoWeAreSection.jsx */
export function CoreListBlock({ ordered, items }) {
  const list = Array.isArray(items) ? items.filter((x) => typeof x === 'string' && x.trim() !== '') : [];
  if (list.length === 0) {
    return null;
  }
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <div className="max-w-full mx-auto mb-5 px-[50px]">
      <Tag
        className="pl-6 space-y-2"
        style={{
          listStyleType: ordered ? 'decimal' : 'circle',
          color: BODY_COLOR,
          lineHeight: 1.6,
        }}
      >
        {list.map((item, i) => (
          <li key={i} className="text-sm md:text-base">
            {decodeHtmlEntities(item)}
          </li>
        ))}
      </Tag>
    </div>
  );
}

export function CoreHeadingBlock(props) {
  const { content, level, anchor } = props;
  if (!content) {
    return null;
  }
  const lv = Math.min(Math.max(Number(level) || 2, 1), 6);
  const idx = lv - 1;
  const Tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'][idx];
  const text = decodeHtmlEntities(content);
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(text);
  const id = explicitAnchor || derived || undefined;
  const spacingStyle = blockSpacingStyle(props);

  if (lv <= 2) {
    return (
      <SectionPageTitle anchor={id} color={TEAL} as={Tag} style={spacingStyle}>
        {text}
      </SectionPageTitle>
    );
  }

  return (
    <Tag
      id={id}
      className="max-w-full mx-auto mt-4 mb-2 text-center md:text-left px-7"
      style={{
        color: TEAL,
        fontFamily: 'Museo900-Regular, Museo, sans-serif',
        fontSize: '26px',
        ...spacingStyle,
      }}
    >
      {text}
    </Tag>
  );
}
