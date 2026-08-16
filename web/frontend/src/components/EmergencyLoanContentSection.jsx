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

export function EmergencyLoanAboutSection({ index = 0 }) {
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
          Emergency Loan
        </h2>

        <p className="text-base mb-0" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          The Emergency Loan provides members with quick financial support during unexpected
          situations that require immediate attention. Whether facing urgent medical expenses,
          funeral expenses, court fines, or unforeseen family obligations among other pressing
          financial needs, this loan ensures that members can access timely assistance without
          disrupting their financial stability. Designed for speed, convenience, and affordability,
          the Emergency Loan reflects Ports Sacco&apos;s commitment to standing with members when they
          need it most.
        </p>
      </div>
    </section>
  );
}

export function EmergencyLoanWhateverSection() {
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

export function EmergencyLoanFeaturesSection({ index = 1 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const features = [
    {
      title: 'Affordable Borrowing',
      description: (
        <>
          Access funding of up to <span className="text-xl font-bold">five (5)</span> times your{' '}
          <span className="text-xl font-bold">member deposits</span>.
        </>
      ),
    },
    {
      title: 'Flexible Repayment Period',
      description:
        'Enjoy a repayment period of up to 12 months, allowing you to spread the cost across manageable installments.',
    },
    {
      title: 'Convenient Loan Limit',
      description: (
        <>
          Borrow up to <span className="text-xl font-bold">Ksh 1,000,000</span> to support your
          emergency needs.
        </>
      ),
    },
    {
      title: 'Timely Support',
      description:
        'Structured to ensure members can access funds in time as well as the Sacco’s commitment to standing with members when they need financing most.',
    },
    {
      title: 'Competitive Interest Rate',
      description: (
        <>
          Benefit from an attractive <span className="text-xl font-bold">14.5% per annum</span>{' '}
          <span className="text-xl font-bold">interest rate</span>.
        </>
      ),
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
          Features of the Emergency Loan
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

export function EmergencyLoanEligibilitySection({ index = 2 }) {
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
          Emergency Loan Eligibility
        </h2>

        <p className="text-base mb-8" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          Any salaried, self-employed or professional Public and Private company, Government and Public
          Sector employee is eligible for the Emergency loan.
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

