import React, { useState } from 'react';

const TEAL = '#40C9BF';
const BODY_COLOR = '#333333';
const HEADER_BG = '#eef0f3';

const DEFAULT_ITEMS = [
  {
    heading: 'ICD AWARDS 2025 - NATIONAL',
    content:
      '<ul><li>Best Managed Sacco countrywide (Employer based, Asset base over 10B) - <strong>Position 3</strong></li><li>Best in Technology Optimization Country wide (Employer based, Asset base above 10B) - <strong>Position 2</strong></li><li>Best in Capitalization country wide (Employer based, asset base above 10B) - <strong>Position 3</strong></li></ul>',
  },
  {
    heading: 'ICD AWARDS 2025 - MOMBASA COUNTY',
    content:
      '<ul><li>Best Co-operative Society - <strong>Position 1</strong></li><li>Best Capitalized Co-operative Society - <strong>Position 1</strong></li><li>Highest Returns on Assets - <strong>Position 1</strong></li><li>1st to present Audited Accounts - <strong>Position 1</strong></li><li>Best in Education and Training - <strong>Position 2</strong></li><li>Best Insured Sacco Society - <strong>Position 2</strong></li><li>Most Innovative Sacco Society Position - <strong>Position 2</strong></li></ul>',
  },
  {
    heading: 'ASK NAIROBI INTERNATIONAL SHOW - 2025',
    content: '<ul><li>Best Cooperative Movement stand - <strong>Position 1</strong></li></ul>',
  },
];

function normalizeItems(items) {
  const saved = Array.isArray(items) ? items : [];
  const count = Math.max(DEFAULT_ITEMS.length, saved.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = DEFAULT_ITEMS[i] || { heading: '', content: '' };
    const s = saved[i] && typeof saved[i] === 'object' ? saved[i] : {};
    const heading = String(s.heading ?? '').trim();
    const content = typeof s.content === 'string' ? s.content : '';
    out.push({
      heading: heading || d.heading,
      content: content.trim() ? content : d.content,
    });
  }
  return out;
}

export function AboutUsAwardsBlock({ title = 'Awards', items }) {
  const rows = normalizeItems(items);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-full mx-auto px-12 my-8 lg:my-10">
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-8"
        style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif', fontSize: '26px' }}
      >
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {rows.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border border-gray-200 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 py-4 px-5 text-left font-bold text-sm uppercase tracking-wide transition-colors"
                style={{ backgroundColor: HEADER_BG, color: isOpen ? TEAL : BODY_COLOR }}
                aria-expanded={isOpen}
                aria-controls={`awards-content-${index}`}
                id={`awards-header-${index}`}
              >
                <span>{item.heading}</span>
                <span className="flex-shrink-0" aria-hidden>{isOpen ? '−' : '+'}</span>
              </button>
              <div
                id={`awards-content-${index}`}
                role="region"
                aria-labelledby={`awards-header-${index}`}
                aria-hidden={!isOpen}
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <div
                    className="py-4 px-5 bg-white text-sm md:text-base"
                    style={{ color: BODY_COLOR, lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
