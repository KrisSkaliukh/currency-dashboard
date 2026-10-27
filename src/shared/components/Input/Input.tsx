import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const describedBy = [props['aria-describedby'], error ? errorId : undefined]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={describedBy || undefined}
          className={[styles.input, error && styles.inputError, className]
            .filter(Boolean)
            .join(' ')}
        />

        {error && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
