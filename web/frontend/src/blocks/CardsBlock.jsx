import React from 'react';

/** Placeholder until `custom/cards` is registered in WordPress with attributes. */
export function CardsBlock({ heading }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {heading ? <h2 className="text-xl font-semibold mb-4">{heading}</h2> : null}
      <p className="text-sm text-neutral-500">Cards block (connect data in WordPress, then map fields here).</p>
    </section>
  );
}
