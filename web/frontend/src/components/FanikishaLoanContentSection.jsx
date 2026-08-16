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

export function FanikishaLoanAboutSection({ index = 0 }) {
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
          Fanikisha Loan
        </h2>

        <p className="text-base mb-0" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
        Fanikisha Loan is a Ports Sacco Product designed to make your goals possible in the case of restructuring debt, consolidating loans, or starting over. It’s flexible, accessible, and tailored to your needs, empowering you to breath
again financially and move forward with confidence. Turn your financial challenges into new beginnings.
with fanikisha loans from Ports DT Sacco.
        </p>

        <div className="mt-6">
          <div className="font-bold mb-4" style={{ color: BODY_COLOR }}>
            Fanikisha Loan targets:
          </div>
          <ul className="list-disc pl-6 space-y-3" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
            <li>
            Borrowers seeking loan restructuring or consolidation - Regain financial stability and peace of mind.
            </li>
            <li>
            Civil servants, including TSC and National Government employees - Enjoy flexible terms and competitive rates. Every goal is within reach!
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function FanikishaLoanWhateverSection() {
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
            Get financing for whatever you need now!
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

export function FanikishaLoanFeaturesSection({ index = 1 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const features = [
    {
      title: 'Maximum Loan Amount',
      description: 
      <>
      Up to Ksh <span className="text-xl font-bold">35,000,000</span> and up to <span className="text-xl font-bold">5</span> times your BOSA Deposits, and subject to your ability to repay as determined by the loan appraisal process. Collateral to be used.,
      </>
    },
    {
      title: 'Extended Repayment Period',
      description: <>Enjoy a flexible repayment period of up to <span className="text-xl font-bold">120 months</span> <span className="text-xl font-bold">(10 years)</span> with manageable monthly installments.</>,
    },
    {
      title: 'Competitive Interest Rates',
      description: 'Benefit from an attractive rate of 14.5% per annum, reducing balance.',
    },
    {
      title: 'Share Capital',
      description: 'Minimum Share Capital: Ksh 1,000.',
    },
    {
      title: 'Boost Option',
      description: 'Increase BOSA Deposits or Share Capital from the loan amount.',
    },
    {
      title: 'No Waiting Period',
      description: 'For confirmed members on payroll (minimum 3 months).',
    },
    {
      title: 'New Employees',
      description: 'Access up to Ksh 500,000 within your first 3 months.',
    },
    {
      title: 'Top-Up Eligibility',
      description: 'Every 3 months.',
    },
    {
      title: 'Loan Range',
      description: 'Ksh 50,000 - 35,000,000.',
    },
    {
      title: 'Early Repayment',
      description: 'No Early Payment Penalties.',
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
          Features of Fanikisha Loan
        </h2>

        <div className="flex flex-col space-y-6">
          {pairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '24px', flexShrink: 0 }}>
                  <CheckmarkIcon />
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div
                    className="font-bold mb-2 text-[22px]"
                    style={{ color: BODY_COLOR, fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
                  >
                    {pair.left.title}
                  </div>
                  <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
                    {pair.left.description}
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
                      style={{ color: BODY_COLOR, fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
                    >
                      {pair.right.title}
                    </div>
                    <div style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
                      {pair.right.description}
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

export function FanikishaLoanEligibilitySection({ index = 2 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';

  const eligibilityCriteria = [
    { title: 'Maximum Loan Amount', description: 'Up to Ksh 35,000,000.' },
    { title: 'Loan Guarantors', description: 'Cumulative responsibility-based guarantees.' },
    { title: 'Self-Guarantee', description: 'Up to 95% of your BOSA Deposits.' },
    { title: 'Cash Cover', description: 'Fixed Deposit with Ports DT Sacco.' },
    {
      title: 'Chattels',
      description: 'Motor vehicles not older than 10 years from the date of manufacture and not for commercial use.',
    },
    {
      title: 'Legal Charge',
      description: 'On land or buildings in urban areas, free of encumbrances.',
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
          Fanikisha Eligibility
        </h2>

        <p className="text-base mb-8" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          Acceptable security forms include, and may be combined as needed:
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

