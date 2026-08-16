import React from 'react';
import { NewsCardsSection } from '../components/NewsCardsSection';

export function NewsGridBlock({ perPage = 9, readMoreLabel = 'Read More' }) {
  return <NewsCardsSection perPage={perPage} readMoreLabel={readMoreLabel} />;
}
