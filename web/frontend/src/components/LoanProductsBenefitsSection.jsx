import React from 'react';
import { Check } from 'lucide-react';

const TEAL = '#22ABB5';
const BODY_COLOR = '#000000';
const ORANGE = '#ED6E2A';

function CheckmarkIcon() {
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: '24px',
        height: '24px',
        backgroundColor: ORANGE,
        flexShrink: 0,
      }}
    >
      <Check className="w-4 h-4 text-white" strokeWidth={3} />
    </div>
  );
}

// Mirror of SavingsProductSaveSection but focused on loan benefits.
const loanBenefits = [
  {
    label: 'Fast Processing:',
    text: 'Most loans are processed within minutes, giving you access to funds when you need them most.',
  },
  {
    label: 'Flexible Terms:',
    text: 'Enjoy a wide range of repayment periods for both short-term and long-term loan products.',
  },
  {
    label: 'Competitive Rates:',
    text: 'Benefit from member-friendly interest rates designed to keep repayments manageable.',
  },
  {
    label: 'Tailored Solutions:',
    text: 'Choose from emergency, school fee, business, development and asset finance loans that match your goals.',
  },
];

export function LoanProductsBenefitsSection({ index = 0 }) {
  const backgroundColor = index % 2 === 0 ? '#ffffff' : '#eef0f3';

  const pairs = [];
  for (let i = 0; i < loanBenefits.length; i += 2) {
    pairs.push({
      left: loanBenefits[i],
      right: loanBenefits[i + 1] || null,
    });
  }

  return (
    <section
      id="loan-benefits"
      className="w-full py-11 px-6 lg:py-11 pb-[1px] lg:pb-[1px]"
      style={{
        fontFamily: 'Museo, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-[27px] md:text-[27px] font-black mb-4 pb-[20px]"
          style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          Why Borrow With Us
        </h2>

        <div className="flex flex-col space-y-6 mb-12">
          {pairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '24px', flexShrink: 0 }}>
                  <CheckmarkIcon />
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div
                    className="font-bold mb-2 text-[22px]"
                    style={{ color: BODY_COLOR, fontFamily: 'Museo, Helvetica, sans-serif' }}
                  >
                    {pair.left.label}
                  </div>
                  <div
                    style={{ color: BODY_COLOR, lineHeight: 1.6, fontFamily: 'Museo, Helvetica, sans-serif' }}
                  >
                    {pair.left.text}
                  </div>
                </div>
              </div>

              {pair.right && (
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', flexShrink: 0 }}>
                    <CheckmarkIcon />
                  </div>
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <div
                      className="font-bold mb-2 text-[22px]"
                      style={{ color: BODY_COLOR, fontFamily: 'Museo, Helvetica, sans-serif' }}
                    >
                      {pair.right.label}
                    </div>
                    <div
                      style={{ color: BODY_COLOR, lineHeight: 1.6, fontFamily: 'Museo, Helvetica, sans-serif' }}
                    >
                      {pair.right.text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

