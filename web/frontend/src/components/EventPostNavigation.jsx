import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function NavLink({ item, direction }) {
  const isPrev = direction === 'previous';

  if (!item?.slug) {
    return <span className="min-w-0" aria-hidden />;
  }

  const label = isPrev ? 'Previous event' : 'Next event';
  const title = item.title || (isPrev ? 'Previous' : 'Next');

  return (
    <Link
      to={`/events/${item.slug}`}
      className={`group flex min-w-0 items-center gap-2 text-sm font-semibold text-[#22acb6] transition-colors hover:text-[#ee6e2a] ${
        isPrev ? 'justify-start text-left' : 'justify-end text-right'
      }`}
      aria-label={`${label}: ${title}`}
    >
      {isPrev ? <ChevronLeft className="size-4 shrink-0" aria-hidden /> : null}
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] group-hover:text-[#ee6e2a]">
          {isPrev ? 'Previous' : 'Next'}
        </span>
        <span className="block truncate">{title}</span>
      </span>
      {!isPrev ? <ChevronRight className="size-4 shrink-0" aria-hidden /> : null}
    </Link>
  );
}

export function EventPostNavigation({ navigation }) {
  const previous = navigation?.previous || null;
  const next = navigation?.next || null;

  return (
    <nav
      className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:grid-cols-3 sm:items-center sm:gap-6 sm:p-6"
      aria-label="Event navigation"
    >
      <NavLink item={previous} direction="previous" />

      <div className="flex justify-center">
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#22acb6] transition-colors hover:text-[#ee6e2a]"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to events
        </Link>
      </div>

      <NavLink item={next} direction="next" />
    </nav>
  );
}
