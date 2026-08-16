import React from 'react';
import { BoardOfDirectorsHeroSection } from './BoardOfDirectorsHeroSection';
import { BoardOfDirectorsSection } from './BoardOfDirectorsSection';
import { SupervisoryCommitteeSection } from './SupervisoryCommitteeSection';

export function BoardOfDirectorsPage() {
  return (
    <div style={{ backgroundColor: '#f3f5f7' }}>
      <BoardOfDirectorsHeroSection />
      <main className="relative z-10 bg-transparent max-w-7xl mx-auto w-full px-0 pb-0 pt-[25px] mt-[20px] mb-16">
        <BoardOfDirectorsSection />
        <SupervisoryCommitteeSection />
      </main>
    </div>
  );
}
