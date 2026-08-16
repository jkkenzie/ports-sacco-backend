import styles from './ContactForm.module.css';

const TAB_HINTS = {
  1: 'For a single member',
  2: 'For two or more signatories',
  3: 'For a registered group or company',
};

export default function AccountTypeTabs({ field, value, error, onChange }) {
  const labelId = `label-${field.id}`;
  const choices = field.choices || [];

  return (
    <div className={`${styles.field} ${styles.accountTypeField}`}>
      <span className={styles.label} id={labelId}>
        {field.label}
        {field.required ? <span className={styles.required}>*</span> : null}
      </span>

      <div
        className={`${styles.accountTabs} ${error ? styles.accountTabsError : ''}`}
        role="tablist"
        aria-labelledby={labelId}
      >
        {choices.map((choice) => {
          const selected = String(value ?? '') === String(choice.value);
          const hint = TAB_HINTS[choice.value] || '';

          return (
            <button
              key={choice.value}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`${styles.accountTab} ${selected ? styles.accountTabActive : ''}`}
              onClick={() => onChange(String(choice.value))}
            >
              <span className={styles.accountTabLabel}>{choice.label}</span>
              {hint ? <span className={styles.accountTabHint}>{hint}</span> : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
