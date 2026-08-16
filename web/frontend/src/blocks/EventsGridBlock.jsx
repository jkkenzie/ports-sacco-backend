import React from 'react';
import { EventsArchiveSection } from '../components/EventsArchiveSection';

export function EventsGridBlock({ categoryId = 0 }) {
  return <EventsArchiveSection categoryId={categoryId} />;
}
