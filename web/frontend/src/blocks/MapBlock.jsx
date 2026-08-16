import React from 'react';

/** Placeholder: render a map in React using lat/lng from WordPress attributes. */
export function MapBlock({ lat, lng, zoom, label }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {label ? <h2 className="text-lg font-medium mb-2">{label}</h2> : null}
      <p className="text-sm text-neutral-500">
        Map block — lat {lat}, lng {lng}, zoom {zoom} (wire to your map component).
      </p>
    </section>
  );
}
