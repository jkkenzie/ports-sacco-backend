import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const TEAL = '#22ACB6';
const BODY_COLOR = '#000000';

const faqData = [
  {
    question: 'Can I pay off my loan early?',
    answer: 'Yes, you can pay off your loan early. Please contact us for details on early repayment options.',
  },
  {
    question: 'Can you offer refinancing?',
    answer: 'Yes, we offer refinancing options. Contact our team to discuss your refinancing needs.',
  },
  {
    question: 'When should I apply?',
    answer: 'You can apply at any time. Our application process is open throughout the year.',
  },
  {
    question: 'Where are you located?',
    answer: 'We have multiple branches. Please visit our contact page for branch locations and contact information.',
  },
];

export function EmergencyLoanFAQSection({ index = 3 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="faq"
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
          Frequently Asked Questions
        </h2>

        <p className="text-base mb-8" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          For each loan product or service offered by Ports DT Sacco, we will need an FAQ&apos;s page.
        </p>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                style={{ color: BODY_COLOR }}
              >
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="font-semibold text-base flex-1">{faq.question}</span>
              </button>
              {openIndex === idx && (
                <div className="px-4 py-4 pl-12" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

