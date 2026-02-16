import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const TEAL = '#40C9BF';
const BODY_COLOR = '#333333';
const HEADER_BG = '#eef0f3';

const nationalAwards = [
  'Best Managed Sacco countrywide (Employer based, Asset base over 10B) - **Position 3**',
  'Best in Technology Optimization Country wide (Employer based, Asset base above 10B) - **Position 2**',
  'Best in Capitalization country wide (Employer based, asset base above 10B) - **Position 3**',
];

const accordionItems = [
  {
    id: 'national',
    title: 'ICD AWARDS 2025 - NATIONAL',
    content: nationalAwards,
  },
  {
    id: 'mombasa',
    title: 'ICD AWARDS 2025 - MOMBASA COUNTY',
    content: [
      'Award details for Mombasa County category will be listed here.',
    ],
  },
  {
    id: 'ask',
    title: 'ASK NAIROBI INTERNATIONAL SHOW - 2025',
    content: [
      'Award details for ASK Nairobi International Show will be listed here.',
    ],
  },
];

function formatBulletText(text) {
  const parts = [];
  let remaining = text;
  while (remaining.includes('**')) {
    const before = remaining.indexOf('**');
    const after = remaining.indexOf('**', before + 2);
    if (after === -1) break;
    parts.push({ type: 'text', value: remaining.slice(0, before) });
    parts.push({ type: 'bold', value: remaining.slice(before + 2, after) });
    remaining = remaining.slice(after + 2);
  }
  if (remaining) parts.push({ type: 'text', value: remaining });
  return parts;
}

export function AboutUsAwardsSection() {
  const [openId, setOpenId] = useState('national');

  return (
    <section
      id="awards"
      className="w-full bg-white py-12 lg:py-16"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          style={{
            color: TEAL,
            fontFamily: 'Museo700-Regular, Museo, sans-serif',
            fontSize: '26px',
          }}
        >
          Awards
        </h2>

        <div className="flex flex-col gap-2">
          {accordionItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 py-4 px-5 text-left font-bold text-sm uppercase tracking-wide transition-colors"
                  style={{
                    backgroundColor: HEADER_BG,
                    color: isOpen ? TEAL : BODY_COLOR,
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`awards-content-${item.id}`}
                  id={`awards-header-${item.id}`}
                >
                  <span>{item.title}</span>
                  <span className="flex-shrink-0" aria-hidden>
                    {isOpen ? (
                      <Minus className="w-5 h-5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
                <div
                  id={`awards-content-${item.id}`}
                  role="region"
                  aria-labelledby={`awards-header-${item.id}`}
                  className={isOpen ? 'block' : 'hidden'}
                >
                  <ul
                    className="py-4 px-5 pl-6 space-y-2 bg-white"
                    style={{
                      color: BODY_COLOR,
                      lineHeight: 1.6,
                      listStyleType: 'circle',
                    }}
                  >
                    {item.content.map((bullet, idx) => {
                      const parts = formatBulletText(bullet);
                      return (
                        <li key={idx} className="text-sm md:text-base">
                          {parts.map((part, i) =>
                            part.type === 'bold' ? (
                              <strong key={i}>{part.value}</strong>
                            ) : (
                              <span key={i}>{part.value}</span>
                            )
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
