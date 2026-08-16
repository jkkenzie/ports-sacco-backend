import React, { useMemo, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeItems(items) {
  const list = Array.isArray(items) ? items : [];
  return list
    .map((it) => ({
      question: String(it?.question || '').trim(),
      answer: String(it?.answer || '').trim(),
    }))
    .filter((it) => it.question || it.answer);
}

export function AssetFinanceFaqBlock({
  title = 'Frequently Asked Questions',
  intro = '',
  anchor,
  backgroundColor = '#eef0f3',
  titleColor = '#22ACB6',
  textColor = '#000000',
  questionColor = '#000000',
  borderColor = '#e5e7eb',
  hoverBgColor = '#f9fafb',
  iconColor = '#000000',
  items = [],
}) {
  const normalized = useMemo(() => normalizeItems(items), [items]);
  const [openIndex, setOpenIndex] = useState(null);
  const [hovered, setHovered] = useState(null);

  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(title);
  const id = explicitAnchor || derived || undefined;

  if (normalized.length === 0) return null;

  return (
    <section
      id={id || 'faq'}
      className="w-full py-15 px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || '#eef0f3',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: titleColor || '#22ACB6', fontFamily: 'Museo900-Regular, Museo, sans-serif' }}>
          {title}
        </h2>

        {String(intro || '').trim() ? (
          <p className="text-base mb-8" style={{ color: textColor || '#000000', lineHeight: 1.6 }}>
            {intro}
          </p>
        ) : null}

        <div className="space-y-4">
          {normalized.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const isHover = hovered === idx;
            return (
              <div key={idx} className="overflow-hidden" style={{ border: `1px solid ${borderColor || '#e5e7eb'}` }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                  style={{
                    color: questionColor || '#000000',
                    backgroundColor: isHover ? hoverBgColor || '#f9fafb' : 'transparent',
                  }}
                >
                  {isOpen ? (
                    <Minus className="w-5 h-5 flex-shrink-0" style={{ color: iconColor || questionColor || '#000000' }} />
                  ) : (
                    <Plus className="w-5 h-5 flex-shrink-0" style={{ color: iconColor || questionColor || '#000000' }} />
                  )}
                  <span className="font-semibold text-base flex-1">{faq.question}</span>
                </button>
                {isOpen ? (
                  <div className="px-4 py-4 pl-12" style={{ color: textColor || '#000000', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

