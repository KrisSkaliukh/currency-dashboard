import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

import styles from './Select.module.css';

type SelectOption =
  | string
  | {
      label: string;
      value: string;
    };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      id,
      className,
      options,
      placeholder = 'Select an option',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={selectId}>
            {label}
          </label>
        )}

        <select
          {...props}
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[styles.select, error && styles.selectError, className]
            .filter(Boolean)
            .join(' ')}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map(option => {
            const value = typeof option === 'string' ? option : option.value;

            const text = typeof option === 'string' ? option : option.label;

            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>

        <span
          id={errorId}
          className={`${styles.error} ${error ? styles.errorVisible : ''}`}
          role={error ? 'alert' : undefined}
        >
          {error || ''}
        </span>
      </div>
    );
  },
);
