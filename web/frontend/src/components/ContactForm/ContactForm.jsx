import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { customApiUrl } from '../../api/wp';
import AccountTypeTabs from './AccountTypeTabs';
import FileUploadField from './FileUploadField';
import { groupVisibleFieldsForLayout } from './formLayout';
import {
  buildInitialState,
  cssLayoutClass,
  getFieldMetaKeys,
  getOrderedFields,
  isFieldVisible,
  serializeForSubmit,
  validateClient,
} from './formLogic';
import { useFormNonce } from './useFormNonce';
import { getTurnstileToken } from '../../utils/turnstile';
import styles from './ContactForm.module.css';

function randomInt(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function pickOne(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  return arr[randomInt(0, arr.length - 1)];
}

function randomDateISO() {
  const year = randomInt(1985, 2005);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function randomDigits(len) {
  return Array.from({ length: len }, () => String(randomInt(0, 9))).join('');
}

function makeRandomValue(field, key) {
  const meta = `${field?.label || ''} ${key || ''}`.toLowerCase();
  const choices = Array.isArray(field?.choices) ? field.choices : [];

  if (field.type === 'select' || field.type === 'radio') {
    const validChoices = choices.filter((c) => String(c?.value || '').trim() !== '');
    return validChoices.length ? pickOne(validChoices).value : '';
  }

  if (field.type === 'checkbox') {
    const validChoices = choices.filter((c) => String(c?.value || '').trim() !== '');
    if (!validChoices.length) return [];
    const count = Math.min(validChoices.length, randomInt(1, Math.min(2, validChoices.length)));
    return [...validChoices].sort(() => Math.random() - 0.5).slice(0, count).map((c) => c.value);
  }

  if (field.type === 'date-time') return randomDateISO();
  if (field.type === 'email' || meta.includes('email')) return `test.user${randomInt(100, 999)}@example.com`;
  if (field.type === 'url' || meta.includes('website')) return `https://example.com/test-${randomInt(100, 999)}`;
  if (field.type === 'phone' || meta.includes('phone') || meta.includes('mobile')) return `07${randomDigits(8)}`;
  if (field.type === 'number') return String(randomInt(10000, 99999));
  if (field.type === 'file-upload') return [];

  if (meta.includes('id') && !meta.includes('email')) return String(randomInt(10000000, 99999999));
  if (meta.includes('kra')) return `A${randomDigits(9)}Z`;
  if (meta.includes('postal')) return String(randomInt(100, 99999));
  if (meta.includes('city') || meta.includes('town')) return pickOne(['Mombasa', 'Nairobi', 'Kisumu', 'Voi']);
  if (meta.includes('county')) return pickOne(['Mombasa', 'Nairobi', 'Kilifi', 'Kwale']);
  if (meta.includes('address')) return `${randomInt(10, 999)} Test Street`;
  if (meta.includes('occupation') || meta.includes('employ')) return pickOne(['Teacher', 'Engineer', 'Accountant', 'Business Owner']);

  return pickOne([
    `Test Value ${randomInt(100, 999)}`,
    `Sample Data ${randomInt(100, 999)}`,
    `Auto Fill ${randomInt(100, 999)}`,
  ]);
}

function buildTestValues(fields, currentValues) {
  const next = { ...currentValues };

  for (let pass = 0; pass < 3; pass += 1) {
    for (const field of fields) {
      if (!isFieldVisible(field, next)) continue;

      const keys = getFieldMetaKeys(field);
      if (field.type === 'name' && field.format === 'first-last') {
        if (!String(next[keys[0]] || '').trim()) next[keys[0]] = pickOne(['John', 'Jane', 'Alex', 'Faith', 'Brian']);
        if (!String(next[keys[1]] || '').trim()) next[keys[1]] = pickOne(['Mutua', 'Achieng', 'Kamau', 'Otieno', 'Wanjiru']);
        continue;
      }

      const key = keys[0];
      const current = next[key];
      const hasValue = Array.isArray(current) ? current.length > 0 : String(current ?? '').trim() !== '';
      if (!hasValue) {
        next[key] = makeRandomValue(field, key);
      }
    }
  }

  return next;
}

function FieldInput({ field, values, errors, onChange, inRow = false }) {
  const keys = getFieldMetaKeys(field);
  const primaryKey = keys[0];
  const err = errors[primaryKey] || (keys[1] ? errors[keys[1]] : '');
  const errClass = err ? styles.inputError : '';
  const layoutClass = cssLayoutClass(field.css);
  const fieldClass = [styles.field, inRow ? styles.fieldInRow : '', styles[layoutClass] || styles.colFull]
    .filter(Boolean)
    .join(' ');

  if (field.type === 'divider') {
    return (
      <div className={styles.divider} role="heading" aria-level={3}>
        <span className={styles.dividerText}>{field.label}</span>
      </div>
    );
  }

  const labelId = `label-${primaryKey}`;

  if (field.type === 'name' && field.format === 'first-last') {
    return (
      <div className={`${fieldClass} ${styles.colFull}`}>
        <span className={styles.label} id={labelId}>
          {field.label}
          {field.required ? <span className={styles.required}>*</span> : null}
        </span>
        <div className={styles.nameRow}>
          <div className={styles.nameCol}>
            <label className={styles.sublabel} htmlFor={keys[0]}>
              First
            </label>
            <input
              id={keys[0]}
              name={keys[0]}
              type="text"
              className={`${styles.input} ${errors[keys[0]] ? styles.inputError : ''}`}
              value={values[keys[0]] ?? ''}
              onChange={(e) => onChange(keys[0], e.target.value)}
              aria-invalid={Boolean(errors[keys[0]])}
            />
            {errors[keys[0]] ? (
              <span className={styles.error} role="alert">
                {errors[keys[0]]}
              </span>
            ) : null}
          </div>
          <div className={styles.nameCol}>
            <label className={styles.sublabel} htmlFor={keys[1]}>
              Last
            </label>
            <input
              id={keys[1]}
              name={keys[1]}
              type="text"
              className={`${styles.input} ${errors[keys[1]] ? styles.inputError : ''}`}
              value={values[keys[1]] ?? ''}
              onChange={(e) => onChange(keys[1], e.target.value)}
              aria-invalid={Boolean(errors[keys[1]])}
            />
            {errors[keys[1]] ? (
              <span className={styles.error} role="alert">
                {errors[keys[1]]}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className={fieldClass}>
        <label className={styles.label} htmlFor={primaryKey} id={labelId}>
          {field.label}
          {field.required ? <span className={styles.required}>*</span> : null}
        </label>
        <div className={styles.selectWrap}>
          <select
            id={primaryKey}
            name={primaryKey}
            className={`${styles.select} ${errClass}`}
            value={values[primaryKey] ?? ''}
            onChange={(e) => onChange(primaryKey, e.target.value)}
            aria-invalid={Boolean(err)}
            aria-labelledby={labelId}
          >
            <option value="">{field.placeholder || '— Select —'}</option>
            {(field.choices || []).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {err ? (
          <span className={styles.error} role="alert">
            {err}
          </span>
        ) : null}
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className={fieldClass}>
        <span className={styles.label} id={labelId}>
          {field.label}
          {field.required ? <span className={styles.required}>*</span> : null}
        </span>
        <div className={styles.radioGroup} role="radiogroup" aria-labelledby={labelId}>
          {(field.choices || []).map((c) => {
            const selected = String(values[primaryKey] ?? '') === String(c.value);
            return (
              <label key={c.value} className={`${styles.choiceCard} ${selected ? styles.choiceCardActive : ''}`}>
                <input
                  type="radio"
                  name={primaryKey}
                  value={c.value}
                  checked={selected}
                  onChange={(e) => onChange(primaryKey, e.target.value)}
                  className={styles.choiceInput}
                />
                <span className={styles.choiceCardLabel}>{c.label}</span>
              </label>
            );
          })}
        </div>
        {err ? (
          <span className={styles.error} role="alert">
            {err}
          </span>
        ) : null}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const selected = values[primaryKey] || [];
    const inline = field.input_columns === 'inline';

    return (
      <div className={fieldClass}>
        <span className={styles.label} id={labelId}>
          {field.label}
          {field.required ? <span className={styles.required}>*</span> : null}
        </span>
        <div
          className={`${styles.checkboxGroup} ${inline ? styles.checkboxGroupInline : ''}`}
          role="group"
          aria-labelledby={labelId}
        >
          {(field.choices || []).map((c) => {
            const checked = selected.includes(c.value);
            return (
              <label key={c.value} className={`${styles.choiceCard} ${checked ? styles.choiceCardActive : ''}`}>
                <input
                  type="checkbox"
                  name={`${primaryKey}[]`}
                  value={c.value}
                  checked={checked}
                  className={styles.choiceInput}
                  onChange={(e) => {
                    const next = new Set(selected);
                    if (e.target.checked) {
                      next.add(c.value);
                    } else {
                      next.delete(c.value);
                    }
                    onChange(primaryKey, [...next]);
                  }}
                />
                <span className={styles.choiceCardLabel}>{c.label}</span>
              </label>
            );
          })}
        </div>
        {err ? (
          <span className={styles.error} role="alert">
            {err}
          </span>
        ) : null}
      </div>
    );
  }

  if (field.type === 'file-upload') {
    return (
      <FileUploadField
        className={fieldClass}
        field={field}
        files={values[primaryKey] || []}
        error={err}
        onChange={(list) => onChange(primaryKey, list)}
      />
    );
  }

  const inputType =
    field.type === 'email'
      ? 'email'
      : field.type === 'number' || field.type === 'phone'
        ? 'tel'
        : field.type === 'date-time'
          ? 'date'
          : 'text';

  const maxLength =
    field.limit_enabled && field.limit_count
      ? Number(field.limit_count)
      : field.limit_mode === 'characters' && Number(field.limit_count) > 1
        ? Number(field.limit_count)
        : undefined;

  return (
    <div className={fieldClass}>
      <label className={styles.label} htmlFor={primaryKey} id={labelId}>
        {field.label}
        {field.required ? <span className={styles.required}>*</span> : null}
      </label>
      <input
        id={primaryKey}
        name={primaryKey}
        type={inputType}
        className={`${styles.input} ${errClass}`}
        placeholder={field.placeholder || ''}
        value={values[primaryKey] ?? ''}
        maxLength={maxLength}
        onChange={(e) => onChange(primaryKey, e.target.value)}
        aria-invalid={Boolean(err)}
        aria-labelledby={labelId}
      />
      {err ? (
        <span className={styles.error} role="alert">
          {err}
        </span>
      ) : null}
    </div>
  );
}

function FormLayoutGroup({ group, values, errors, onChange }) {
  if (group.kind === 'divider') {
    return <FieldInput field={group.field} values={values} errors={errors} onChange={onChange} />;
  }

  if (group.kind === 'accountType') {
    const key = getFieldMetaKeys(group.field)[0];
    return (
      <AccountTypeTabs
        field={group.field}
        value={values[key]}
        error={errors[key]}
        onChange={(value) => onChange(key, value)}
      />
    );
  }

  if (group.kind === 'row') {
    return (
      <div className={styles.fieldRow}>
        {group.fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            values={values}
            errors={errors}
            onChange={onChange}
            inRow
          />
        ))}
      </div>
    );
  }

  return (
    <FieldInput field={group.field} values={values} errors={errors} onChange={onChange} />
  );
}

export default function ContactForm({ spec: specProp }) {
  const [spec, setSpec] = useState(specProp ?? null);
  const [specLoading, setSpecLoading] = useState(!specProp);
  const { nonceRef, ensureNonce } = useFormNonce();
  const formRef = useRef(null);

  useEffect(() => {
    if (specProp) {
      setSpec(specProp);
      setSpecLoading(false);
      return undefined;
    }

    let cancelled = false;
    import('./onboardingFormSpec')
      .then((mod) => {
        if (!cancelled) {
          setSpec(mod.default);
          setSpecLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSpecLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [specProp]);

  const orderedFields = useMemo(() => (spec ? getOrderedFields(spec) : []), [spec]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const didAutoFillRef = useRef(false);

  useEffect(() => {
    if (spec) {
      setValues(buildInitialState(spec));
      setErrors({});
      setGlobalError('');
      setSuccessMessage('');
    }
  }, [spec]);

  const layoutGroups = useMemo(
    () => groupVisibleFieldsForLayout(orderedFields, values),
    [orderedFields, values]
  );

  const settings = spec?.settings || {};
  const shouldAutoFillForTesting = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search || '');
    const value = String(params.get('test') || '').toLowerCase();
    return value === 'true' || value === '1' || value === 'yes';
  }, []);

  useEffect(() => {
    if (!spec || !orderedFields.length || !shouldAutoFillForTesting || didAutoFillRef.current) {
      return;
    }
    setValues((prev) => buildTestValues(orderedFields, prev));
    didAutoFillRef.current = true;
  }, [spec, orderedFields, shouldAutoFillForTesting]);

  const handleChange = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const scrollToFirstError = useCallback((nextErrors) => {
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey || !formRef.current) return;
    const el = formRef.current.querySelector(`[name="${firstKey}"], [name="${firstKey}[]"], #label-${firstKey}`);
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccessMessage('');

    const clientErrors = validateClient(spec, values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      scrollToFirstError(clientErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const nonce = (await ensureNonce({ force: true })) || nonceRef.current;
      if (!nonce) {
        setGlobalError('Unable to verify the form. Please refresh the page and try again.');
        return;
      }

      const body = await serializeForSubmit({
        ...values,
        form_slug: spec.slug || settings.form_slug || 'onboarding_form',
      });

      const turnstileToken = await getTurnstileToken({ action: 'submit_form' });
      if (turnstileToken) {
        body.turnstileToken = turnstileToken;
      }

      const res = await fetch(customApiUrl('/submit-form'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 200 && data.success) {
        setSuccessMessage(data.message || settings.confirmation?.message || 'Thank you!');
        setValues(buildInitialState(spec));
        formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        scrollToFirstError(data.errors);
        return;
      }

      if (res.status === 429) {
        setGlobalError('Too many attempts, please wait.');
        return;
      }

      setGlobalError('Something went wrong. Please try again later.');
    } catch {
      setGlobalError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (specLoading || !spec) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <span className={styles.loadingSpinner} aria-hidden="true" />
        Loading form…
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="_gotcha"
        value=""
        onChange={() => {}}
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.formCard}>
        {successMessage ? (
          <div className={styles.success} role="status">
            {successMessage}
          </div>
        ) : null}

        {globalError ? (
          <div className={styles.globalError} role="alert">
            {globalError}
          </div>
        ) : null}

        <div className={styles.grid}>
          {layoutGroups.map((group, index) => (
            <FormLayoutGroup
              key={`${group.kind}-${group.field?.id || group.fields?.[0]?.id || index}`}
              group={group}
              values={values}
              errors={errors}
              onChange={handleChange}
            />
          ))}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.submitSpinner} aria-hidden="true" />
                  {settings.submit_text_processing || 'Sending...'}
                </>
              ) : (
                settings.submit_text || 'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
