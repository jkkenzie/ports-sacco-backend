import React from 'react';

const teamBgSvg = '/frontend/team-bg.png';

const TEAL = '#40C9BF';
const ORANGE = '#EE6E2A';
const BODY_COLOR = '#212529';

const supervisoryMembers = [
  { name: 'Mrs. Esha J. Khamisi', title: 'CHAIRLADY', image: null },
  { name: 'Mr. George Ondigo', title: 'SECRETARY', image: null },
  { name: 'Mrs. Jacqueline Omayio', title: 'MEMBER', image: null },
];

export function SupervisoryCommitteeSection() {
  return (
    <section
      id="supervisory-committee"
      className="w-full py-12 lg:py-16"
      style={{
        backgroundColor: '#eef0f3',
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        animation: 'fadeInUp 0.8s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center"
          style={{ 
            color: TEAL,
            fontFamily: 'Museo900-Regular, Museo, sans-serif'
          }}
        >
          The Supervisory Committee
        </h2>

        {/* Three members in a horizontal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {supervisoryMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
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
