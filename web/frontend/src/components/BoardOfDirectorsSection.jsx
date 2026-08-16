import React from 'react';
import boazOmwansaImg from '../../assets/image/team/Mr.-Boaz-Omwansa.png';

const teamBgSvg = '/frontend/team-bg.png';

const TEAL = '#40C9BF';
const ORANGE = '#EE6E2A';
const BODY_COLOR = '#212529';

const boardMembers = [
  { name: 'Mr. Ben J. Chepkechir', title: 'CHAIRMAN', image: null },
  { name: 'Mr. Erick O. Odongo', title: 'VICE CHAIRMAN', image: null },
  { name: 'Ms. Sharon Orimba', title: 'HON. SECRETARY', image: null },
  { name: 'Mr. Boaz Omwansa', title: 'CEO', image: boazOmwansaImg },
  { name: 'Mr. Gervas M. Mwole', title: 'TREASURER', image: null },
  { name: 'Mrs. Emily D. Chamba', title: 'BOARD MEMBER', image: null },
  { name: 'Mrs. Rael Munyoki', title: 'BOARD MEMBER', image: null },
  { name: 'Mr. Joseph O. Odero', title: 'BOARD MEMBER', image: null },
  { name: 'Mr. Silvanus Imbuusi', title: 'BOARD MEMBER', image: null },
  { name: 'Mr. Alfred Konde', title: 'BOARD MEMBER', image: null },
];

export function BoardOfDirectorsSection() {
  return (
    <section
      id="board-of-directors"
      className="w-full bg-white py-12 lg:py-16"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', animation: 'fadeInUp 0.8s ease-out', willChange: 'transform, opacity' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center"
          style={{ 
            color: TEAL,
            fontFamily: 'Museo900-Regular, Museo, sans-serif'
          }}
        >
          The Board of Directors
        </h2>

        {/* Grid layout: First row centered (1 item), then rows of 3 */}
        <div className="flex flex-col items-center">
          {/* First row: Single centered card */}
          <div className="mb-8 md:mb-12">
            <TeamMemberCard member={boardMembers[0]} />
          </div>

          {/* Remaining rows: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
            {boardMembers.slice(1).map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ member }) {
  return (
    <div className="flex flex-col items-center">
      {/* Thumbnail/Image Area */}
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
        {member.image && (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover absolute inset-0"
          />
        )}
      </div>

      {/* Name */}
      <h3
        className="text-center mb-2"
        style={{
          color: BODY_COLOR,
          fontSize: '16px',
          lineHeight: '1.4',
          fontWeight: 'bold',
        }}
      >
        {member.name}
      </h3>

      {/* Title */}
      <p
        className="text-center uppercase"
        style={{
          color: ORANGE,
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {member.title}
      </p>
    </div>
  );
}
