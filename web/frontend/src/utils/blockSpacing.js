const SPACING_KEYS = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
];

/**
 * Build inline spacing styles from block attributes set in the WP editor.
 * @param {Record<string, unknown>} attrs
 * @returns {import('react').CSSProperties}
 */
export function blockSpacingStyle(attrs = {}) {
  const style = {};
  SPACING_KEYS.forEach((key) => {
    const raw = attrs[key];
    if (typeof raw === 'string' && raw.trim()) {
      style[key] = raw.trim();
    }
  });
  return style;
}
