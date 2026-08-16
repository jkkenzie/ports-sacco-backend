import React from 'react';
import { ServicesCardsSectionCpt } from '../components/ServicesCardsSectionCpt';

export function ServicesGridBlock({ categoryId = 0 }) {
  return <ServicesCardsSectionCpt categoryId={categoryId} />;
}
