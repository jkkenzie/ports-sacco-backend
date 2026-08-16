import React from 'react';
import { LoanProductsCardsSectionCpt } from '../components/LoanProductsCardsSectionCpt';

export function LoanProductsGridBlock({ categoryId = 0 }) {
  return <LoanProductsCardsSectionCpt categoryId={categoryId} />;
}

