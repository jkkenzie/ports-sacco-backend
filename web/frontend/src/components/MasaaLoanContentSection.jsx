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

export function MasaaLoanAboutSection({ index = 0 }) {
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
          Masaa Loan
        </h2>

        <p className="text-base mb-0" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          The Masaa Loan is designed to help members address urgent financial needs quickly and
          conveniently. Whether responding to unexpected emergencies or meeting school fees and other
          essential family expenses, this loan provides timely financial support when it matters most.
          With simplified access, manageable repayment terms, and competitive interest rates, the Masaa
          Loan ensures that members can handle pressing financial obligations with confidence and peace
          of mind.
        </p>
      </div>
    </section>
  );
}

export function MasaaLoanWhateverSection() {
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

export function MasaaLoanFeaturesSection({ index = 1 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const features = [
    {
      title: 'Quick Financial Support',
      description: (
        <>
          Ideal for addressing <span className="font-bold">emergency needs</span> and{' '}
          <span className="font-bold">school fees</span> and other{' '}
          <span className="font-bold">education related expenses</span>.
        </>
      ),
    },
    {
      title: 'Accessible Borrowing Power',
      description: (
        <>
          Access funding of up to <span className="text-xl font-bold">five (5)</span> times your{' '}
          <span className="text-xl font-bold">member deposits</span>.
        </>
      ),
    },
    {
      title: 'Convenient Loan Limit',
      description: (
        <>
          Borrow up to <span className="text-xl font-bold">Ksh 1,000,000</span> to meet urgent financial
          obligations.
        </>
      ),
    },
    {
      title: 'Flexible Repayment Period',
      description: (
        <>
          Repay comfortably over a period of up to <span className="text-xl font-bold">12 months</span>.
        </>
      ),
    },
    {
      title: 'Competitive Interest Rate',
      description: (
        <>
          Benefit from an attractive <span className="text-xl font-bold">14.5% per annum</span> interest{' '}
          <span className="font-bold">rate</span>.
        </>
      ),
    },
    {
      title: 'Member-Focused Solution',
      description:
        'Structured to ensure members can respond quickly to unexpected financial situations without disruption.',
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
          Features of Masaa Loan
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

export function MasaaLoanEligibilitySection({ index = 2 }) {
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
        'Applicant should have the Sacco specified credit score and emonstrated the ability to service the loan through regular income..',
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
          Masaa Loan Eligibility
        </h2>

        <p className="text-base mb-8" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          Any salaried, self-employed or professional Public and Private company, Government and Public
          Sector employee is eligible for the Masaa loan.
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

