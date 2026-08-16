import React from 'react';
import { EventsArchiveSection } from '../components/EventsArchiveSection';

export function EventsArchiveBlock({
  title = 'News & Events',
  intro = 'Stay up to date with the latest happenings, community initiatives, and milestones at Ports SACCO.',
  categoryId = 0,
  emptyMessage = 'No events available right now.',
}) {
  return (
    <EventsArchiveSection
      title={title}
      intro={intro}
      categoryId={categoryId}
      emptyMessage={emptyMessage}
    />
  );
}
