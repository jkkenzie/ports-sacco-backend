import React from 'react';

const TEAL = '#22acb6';

export function HeroBlock({ title, subtitle }) {
  return (
    <section
      className="w-full py-16 px-4 text-center"
      style={{ background: `linear-gradient(135deg, ${TEAL}22 0%, #fff 100%)` }}
    >
      <div className="max-w-3xl mx-auto">
        {title ? (
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f0026] mb-3" style={{ fontFamily: 'Gotham Rounded, sans-serif' }}>
            {title}
          </h1>
        ) : null}
        {subtitle ? <p className="text-lg text-[#65605f]">{subtitle}</p> : null}
      </div>
    </section>
  );
}
