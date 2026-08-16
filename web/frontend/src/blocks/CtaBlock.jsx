import React from 'react';
import { Link } from 'react-router-dom';

/** Placeholder until `custom/cta` is registered in WordPress with attributes. */
export function CtaBlock({ title, buttonText, buttonUrl }) {
  const isExternal = typeof buttonUrl === 'string' && /^https?:\/\//i.test(buttonUrl);
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 text-center">
      {title ? <h2 className="text-2xl font-semibold mb-4">{title}</h2> : null}
      {buttonText && buttonUrl ? (
        isExternal ? (
          <a
            href={buttonUrl}
            className="inline-block px-6 py-2 rounded-md text-white bg-[#ee6e2a] hover:opacity-90"
            rel="noreferrer"
          >
            {buttonText}
          </a>
        ) : (
          <Link to={buttonUrl} className="inline-block px-6 py-2 rounded-md text-white bg-[#ee6e2a] hover:opacity-90">
            {buttonText}
          </Link>
        )
      ) : null}
    </section>
  );
}
