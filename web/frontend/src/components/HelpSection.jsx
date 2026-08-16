import React from 'react';
import { HelpSectionBlock, HELP_SECTION_DEFAULT_PROPS } from '../blocks/HelpSectionBlock';

/** Legacy home page help strip — same layout as the Gutenberg block with default copy. */
export function HelpSection() {
  return <HelpSectionBlock {...HELP_SECTION_DEFAULT_PROPS} />;
}
