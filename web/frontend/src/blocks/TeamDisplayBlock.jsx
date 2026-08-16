import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { fetchTeamMembersList } from '../api/teamMembers';

const TEAL = '#40C9BF';
const ORANGE = '#EE6E2A';
const BODY_COLOR = '#212529';

const teamBgSvg = '/frontend/team-bg.png';

function normalizeMember(m) {
  return {
    id: Number(m?.id || 0),
    slug: String(m?.slug || ''),
    name: String(m?.name || m?.title || '').trim(),
    position: String(m?.position || '').trim(),
    standAlone: Boolean(m?.standAlone),
    excerpt: String(m?.excerpt || '').trim(),
    bio: String(m?.bio || '').trim(),
    imageUrl: String(m?.imageUrl || '').trim(),
  };
}

function buildOrderedMembers(list) {
  const arr = Array.isArray(list) ? list.map(normalizeMember).filter((x) => x.name) : [];
  if (!arr.length) return [];
  // Put standalone first, preserve existing order otherwise.
  const standalone = arr.filter((x) => x.standAlone);
  const rest = arr.filter((x) => !x.standAlone);
  return standalone.concat(rest);
}

export function TeamDisplayBlock({
  sectionId = 'team',
  heading = 'The Board of Directors',
  headingColor = TEAL,
  positionColor = ORANGE,
  nameColor = BODY_COLOR,
  categoryId = 0,
  heroImageUrl = '',
  heroHeight = 260,
  sectionBgColor = '#ffffff',
  maxItems = 0,
}) {
  const [items, setItems] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const lim = Math.max(0, Number(maxItems) || 0);
    fetchTeamMembersList({ categoryId: Number(categoryId) || 0, limit: lim }).then((data) => {
      if (cancelled) return;
      setItems(buildOrderedMembers(data));
    });
    return () => {
      cancelled = true;
    };
  }, [categoryId, maxItems]);

  const members = useMemo(() => items, [items]);
  const active = activeIdx >= 0 ? members[activeIdx] : null;

  const openAt = (idx) => {
    if (idx < 0 || idx >= members.length) return;
    setActiveIdx(idx);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };
  const prev = () => {
    if (!members.length) return;
    const nextIdx = activeIdx <= 0 ? members.length - 1 : activeIdx - 1;
    setActiveIdx(nextIdx);
  };
  const next = () => {
    if (!members.length) return;
    const nextIdx = activeIdx >= members.length - 1 ? 0 : activeIdx + 1;
    setActiveIdx(nextIdx);
  };

  const hasStandalone = members.some((m) => m.standAlone);
  const first = hasStandalone ? members[0] || null : null;
  const rest = hasStandalone ? members.slice(1) : members;

  return (
    <section
      id={sectionId}
      className="w-full py-12 lg:py-16"
      style={{
        backgroundColor: sectionBgColor,
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        animation: 'fadeInUp 0.8s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {heroImageUrl ? (
        <div
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
          style={{
            height: Math.max(120, Number(heroHeight) || 260),
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center"
          style={{ color: headingColor, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          {heading}
        </h2>

        <div className="flex flex-col items-center">
          {first ? (
            <div className="mb-8 md:mb-12">
              <TeamMemberCard member={first} onClick={() => openAt(0)} nameColor={nameColor} positionColor={positionColor} />
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
            {rest.map((m, i) => (
              <TeamMemberCard
                key={m.id || `${m.name}-${i}`}
                member={m}
                onClick={() => openAt(hasStandalone ? i + 1 : i)}
                nameColor={nameColor}
                positionColor={positionColor}
              />
            ))}
          </div>
        </div>
      </div>

      {isOpen && active ? (
        createPortal(<TeamSidePanel member={active} onClose={close} onPrev={prev} onNext={next} />, document.body)
      ) : null}
    </section>
  );
}

function TeamMemberCard({ member, onClick, nameColor, positionColor }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center text-left" style={{ cursor: 'pointer' }}>
      <div
        className="rounded-lg overflow-hidden flex-shrink-0 mb-4 relative"
        style={{
          width: '235px',
          height: '265px',
          backgroundImage: `url(${teamBgSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {member.imageUrl ? (
          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover absolute inset-0" />
        ) : null}
      </div>

      <h3
        className="text-center mb-2"
        style={{
          color: nameColor,
          fontSize: '16px',
          lineHeight: '1.4',
          fontWeight: 'bold',
        }}
      >
        {member.name}
      </h3>

      <p className="text-center uppercase" style={{ color: positionColor, fontSize: '12px', fontWeight: 'bold' }}>
        {member.position || ''}
      </p>
    </button>
  );
}

function TeamSidePanel({ member, onClose, onPrev, onNext }) {
  const desc = member.bio || member.excerpt || '';
  return (
    <div className="fixed inset-0 z-[100]">
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close team member panel"
        onClick={onClose}
      />

      <aside
        className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-2xl overflow-y-auto"
        style={{ animation: 'slideInRight 220ms ease-out' }}
        aria-label="Team member details"
      >
        <div className="p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-2 hover:bg-gray-100"
            aria-label="Close"
            style={{ cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="h-[96px] w-[96px] rounded-full overflow-hidden bg-gray-200">
                {member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" /> : null}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'Museo900-Regular, Museo, sans-serif', color: '#111827' }}>
                {member.name}
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {member.position}
              </p>
            </div>
          </div>

          {desc ? (
            <p className="mt-6 text-[13px] leading-6" style={{ color: '#374151' }}>
              {desc}
            </p>
          ) : null}

          <div className="mt-10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="px-5 py-2 border rounded-md text-sm font-bold bg-[#F5F4EE] hover:bg-[#e8e8e8]"
              style={{ cursor: 'pointer' }}
            >
              PREV
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2 border rounded-md text-sm font-bold bg-[#F5F4EE] hover:bg-[#e8e8e8]"
              style={{ cursor: 'pointer' }}
            >
              NEXT
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

