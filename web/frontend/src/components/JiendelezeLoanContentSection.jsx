import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAL = '#22ACB6';
const BODY_COLOR = '#000000';
const ORANGE = '#ED6E2A';
const WHITE = '#ffffff';

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

export function JiendelezeLoanAboutSection({ index = 0 }) {
  const backgroundColor = index % 2 === 0 ? '#ffffff' : '#eef0f3';

  return (
    <section
      id="about"
      className="w-full py-[60px] px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-black mb-4"
          style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          Jiendeleze Loan
        </h2>

        <p className="text-base mb-0" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
        The Jiendeleze Loan is designed to empower members to take meaningful steps toward their long-term development goals. Whether you are building a home, expanding a business, investing in property, or undertaking other transformative projects, this loan provides the financial strength and flexibility you need to move forward with confidence. With generous limits, competitive interest rates, and extended repayment periods, the Jiendeleze Loan supports members in turning their ambitions into lasting achievements.
        </p>
      </div>
    </section>
  );
}

export function JiendelezeLoanWhateverSection() {
  return (
    <section
      id="what-ever"
      className="w-full py-[60px] px-6 lg:py-[60px]"
      style={{
        fontFamily: 'Museo, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: TEAL,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2
            className="text-2xl md:text-3xl font-black mb-6"
            style={{ color: WHITE, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
          >
            Get financing for whatever you need now
          </h2>
          <div className="flex flex-wrap items-center justify-center">
            <Link
              to="#"
              className="inline-flex items-center justify-center px-11 py-3.5 rounded-full bg-[#ed6e2a] text-[#ffffff] border-2 font-semibold text-xs uppercase tracking-wider transition-colors border-[#22ACB6] hover:bg-[#ffffff] hover:text-[#ed6e2a]"
            >
              ENQUIRE NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JiendelezeLoanFeaturesSection({ index = 1 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const features = [
    {
      title: 'High Loan Limits',
      description: (
        <>
          Access financing from <span className="text-xl font-bold">Ksh 1 million</span> up to{' '}
          <span className="text-xl font-bold">Ksh 100 million</span> to support major development
          projects.
        </>
      ),
    },
    {
      title: 'Extended Repayment Period',
      description: (
        <>
          Enjoy a flexible repayment period of up to{' '}
          <span className="text-xl font-bold">120 months</span>{' '}
          <span className="text-xl font-bold">(10 years)</span> for manageable monthly installments.
        </>
      ),
    },
    {
      title: 'Competitive Interest Rates',
      description: (
        <>
          Benefit from an attractive rate of <span className="text-xl font-bold">14.5% per annum</span>
          , making large-scale financing more affordable.
        </>
      ),
    },
    {
      title: 'Enhanced Borrowing Power',
      description: (
        <>
          Qualify for up to <span className="text-xl font-bold">five (5)</span> times your{' '}
          <span className="text-xl font-bold">member deposits</span>, enabling you to unlock greater
          financial capacity.
        </>
      ),
    },
    {
      title: 'Ideal for Development Projects',
      description:
        'Perfect for property development, business expansion, large investments, and other long-term growth initiatives.',
    },
    {
      title: 'Member-Centered Financing',
      description:
        'Structured to support members at different stages of their financial and investment journey.',
    },
  ];

  const pairs = [];
  for (let i = 0; i < features.length; i += 2) {
    pairs.push({ left: features[i], right: features[i + 1] || null });
  }

  return (
    <section
      id="features"
      className="w-full py-15 px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-black mb-8"
          style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          Features of Jiendeleze Loan
        </h2>

        <div className="flex flex-col space-y-6">
          {pairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '24px', flexShrink: 0 }}>
                  <CheckmarkIcon />
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="font-bold mb-2 text-[22px]" style={{ color: BODY_COLOR }}>
                    {pair.left.title}
                  </div>
                  <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>{pair.left.description}</div>
                </div>
              </div>

              {pair.right && (
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', flexShrink: 0 }}>
                    <CheckmarkIcon />
                  </div>
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <div className="font-bold mb-2 text-[22px]" style={{ color: BODY_COLOR }}>
                      {pair.right.title}
                    </div>
                    <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>{pair.right.description}</div>
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

export function JiendelezeLoanEligibilitySection({ index = 2 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const eligibilityCriteria = [
    { title: 'Active Member', description: 'Be an active member of Ports Sacco.' },
    {
      title: 'Sufficient Member Deposits',
      description: 'Have accumulated sufficient member deposits to support borrowing eligibility.',
    },
    {
      title: 'Credit Rating',
      description:
        'Applicant should have the Sacco specified credit score and demonstrated the ability to service the loan through regular income..',
    },
    {
      title: 'Guarantorship Requirements',
      description: 'Meet the Sacco’s loan appraisal and guarantorship requirements where applicable.',
    },
  ];

  const pairs = [];
  for (let i = 0; i < eligibilityCriteria.length; i += 2) {
    pairs.push({ left: eligibilityCriteria[i], right: eligibilityCriteria[i + 1] || null });
  }

  return (
    <section
      id="eligibility"
      className="w-full py-15 px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-black mb-4"
          style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          Jiendeleze Eligibility
        </h2>

        <p className="text-base mb-8" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          Any salaried, self-employed or professional Public and Private company, Government and Public
          Sector employee is eligible for the Jiendeleze loan.
        </p>

        <div className="flex flex-col space-y-6">
          {pairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '24px', flexShrink: 0 }}>
                  <CheckmarkIcon />
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="font-bold mb-2 text-[22px]" style={{ color: BODY_COLOR }}>
                    {pair.left.title}
                  </div>
                  <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>{pair.left.description}</div>
                </div>
              </div>

              {pair.right && (
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', flexShrink: 0 }}>
                    <CheckmarkIcon />
                  </div>
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <div className="font-bold mb-2 text-[22px]" style={{ color: BODY_COLOR }}>
                      {pair.right.title}
                    </div>
                    <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>{pair.right.description}</div>
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

