/**
 * Shared onboarding form helpers (mirrors PHP form-spec.php).
 */

export function getOrderedFields(spec) {
  const order = spec.field_order || Object.keys(spec.fields || {});
  return order
    .map((id) => spec.fields[id])
    .filter(Boolean)
    .map((field) => ({ ...field, id: String(field.id) }));
}

export function getInputFields(spec) {
  return getOrderedFields(spec).filter((f) => f.type !== 'divider');
}

export function getValueForFieldId(fieldId, values) {
  const key = `field_${fieldId}`;
  if (Object.prototype.hasOwnProperty.call(values, key)) {
    return values[key];
  }
  return values[fieldId] ?? '';
}

function evaluateRule(rule, values) {
  const expected = String(rule.value ?? '');
  let actual = getValueForFieldId(String(rule.field), values);
  if (Array.isArray(actual)) {
    actual = actual.includes(expected) ? expected : '';
  } else {
    actual = String(actual ?? '');
  }
  const op = rule.operator || '==';
  switch (op) {
    case '!=':
    case 'not':
      return actual !== expected;
    case 'contains':
      return expected !== '' && actual.includes(expected);
    case 'empty':
      return actual === '';
    case 'not_empty':
      return actual !== '';
    default:
      return actual === expected;
  }
}

export function isFieldVisible(field, values) {
  if (!field.conditional_logic) {
    return true;
  }
  const groups = field.conditionals || [];
  if (!groups.length) {
    return true;
  }
  const type = field.conditional_type || 'show';
  const anyGroupMatches = groups.some(
    (group) => Array.isArray(group) && group.every((rule) => evaluateRule(rule, values))
  );
  return type === 'hide' ? !anyGroupMatches : anyGroupMatches;
}

export function getFieldMetaKeys(field) {
  const id = String(field.id);
  if (field.type === 'name' && field.format === 'first-last') {
    return [`field_${id}_first`, `field_${id}_last`];
  }
  return [`field_${id}`];
}

export function buildInitialState(spec) {
  const state = { _gotcha: '' };
  for (const field of getInputFields(spec)) {
    const keys = getFieldMetaKeys(field);
    if (field.type === 'checkbox') {
      state[keys[0]] = [];
    } else if (field.type === 'name' && field.format === 'first-last') {
      state[keys[0]] = '';
      state[keys[1]] = '';
    } else if (field.type === 'file-upload') {
      state[keys[0]] = [];
    } else {
      state[keys[0]] = '';
    }
  }
  return state;
}

function fieldMaxLength(field) {
  if (field.limit_enabled && field.limit_count) {
    return Number(field.limit_count) || 0;
  }
  if (field.limit_mode === 'characters' && field.limit_count) {
    const n = Number(field.limit_count);
    return n > 1 ? n : 0;
  }
  return 0;
}

export function validateClient(spec, values) {
  const errors = {};

  for (const field of getInputFields(spec)) {
    if (!isFieldVisible(field, values)) {
      continue;
    }

    const label = (field.label || `Field ${field.id}`).replace(/:$/, '');
    const keys = getFieldMetaKeys(field);

    if (field.type === 'name' && field.format === 'first-last') {
      const first = String(values[keys[0]] ?? '').trim();
      const last = String(values[keys[1]] ?? '').trim();
      if (field.required) {
        if (!first) errors[keys[0]] = `${label} (first name) is required.`;
        if (!last) errors[keys[1]] = `${label} (last name) is required.`;
      }
      continue;
    }

    if (field.type === 'checkbox') {
      const selected = values[keys[0]] || [];
      if (field.required && (!Array.isArray(selected) || selected.length === 0)) {
        errors[keys[0]] = `${label} is required.`;
      }
      continue;
    }

    if (field.type === 'file-upload') {
      const files = values[keys[0]];
      const count = Array.isArray(files) ? files.length : files ? 1 : 0;
      if (field.required && count === 0) {
        errors[keys[0]] = `${label} is required.`;
      }
      continue;
    }

    const value = String(values[keys[0]] ?? '').trim();
    if (field.required && value === '') {
      errors[keys[0]] = `${label} is required.`;
      continue;
    }
    if (value === '') {
      continue;
    }

    const max = fieldMaxLength(field);
    if (max > 0 && value.length > max) {
      errors[keys[0]] = `${label} must be at most ${max} characters.`;
    }

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[keys[0]] = `${label} must be a valid email address.`;
    }

    if (field.type === 'url') {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch {
        errors[keys[0]] = `${label} must be a valid URL.`;
      }
    }
  }

  return errors;
}

export function cssLayoutClass(css) {
  if (!css) return '';
  if (css.includes('wpforms-first')) return 'colFirst';
  if (css.includes('one-fourth')) return 'colQuarter';
  if (css.includes('one-third')) return 'colThird';
  if (css.includes('one-half')) return 'colHalf';
  if (css.includes('two-thirds')) return 'colTwoThirds';
  if (css.includes('two-fourths')) return 'colTwoFourths';
  return 'colFull';
}

async function readFileAsPayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        data: reader.result,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Prepare JSON body with base64 file payloads. */
export async function serializeForSubmit(values) {
  const out = { ...values, _gotcha: '' };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (!Array.isArray(val) || val.length === 0 || !(val[0] instanceof File)) {
      continue;
    }
    out[key] = await Promise.all(val.map((f) => readFileAsPayload(f)));
  }
  return out;
}
