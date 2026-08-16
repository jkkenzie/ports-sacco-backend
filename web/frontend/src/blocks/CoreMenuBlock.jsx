import React from 'react';

/**
 * WordPress core/navigation exposes complex refs; the headless API does not expand it.
 * Prefer the REST menu endpoint + Header; this stub avoids crashes if a nav block appears.
 */
export function CoreMenuBlock() {
  return null;
}
