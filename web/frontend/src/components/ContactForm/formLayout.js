import { cssLayoutClass, isFieldVisible } from './formLogic';

export const ACCOUNT_TYPE_FIELD_ID = '28';

export function isAccountTypeField(field) {
  return String(field?.id) === ACCOUNT_TYPE_FIELD_ID;
}

export function isSignatoryRowField(field) {
  const label = String(field?.label || '').toLowerCase();
  return /^\d+(st|nd|rd|th)\s+(signatory|director\/official)/.test(label);
}

/**
 * Group visible fields into full-width items and multi-column rows.
 * Rows break on wpforms-first (WPForms row-start hint) or full-width fields.
 */
export function groupVisibleFieldsForLayout(orderedFields, values) {
  /** @type {Array<{ kind: 'divider' | 'accountType' | 'field' | 'row', field?: object, fields?: object[] }>} */
  const groups = [];
  /** @type {object[]} */
  let row = [];

  const flushRow = () => {
    if (row.length) {
      groups.push({ kind: 'row', fields: [...row] });
      row = [];
    }
  };

  for (const field of orderedFields) {
    if (!isFieldVisible(field, values)) {
      continue;
    }

    if (field.type === 'divider') {
      flushRow();
      groups.push({ kind: 'divider', field });
      continue;
    }

    if (isAccountTypeField(field)) {
      flushRow();
      groups.push({ kind: 'accountType', field });
      continue;
    }

    const css = String(field.css || '');
    const layout = cssLayoutClass(css);
    const isInlineCol = ['colQuarter', 'colThird', 'colHalf', 'colTwoThirds', 'colTwoFourths'].includes(layout);
    const isRowStart = css.includes('wpforms-first') || isSignatoryRowField(field);

    if (isRowStart && row.length) {
      flushRow();
    }

    if (!isInlineCol) {
      flushRow();
      groups.push({ kind: 'field', field });
      continue;
    }

    row.push(field);
  }

  flushRow();
  return groups;
}
