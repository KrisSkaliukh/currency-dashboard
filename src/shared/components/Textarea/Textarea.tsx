import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

import styles from './Textarea.module.css';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={textareaId}>
            {label}
          </label>
        )}

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          className={[styles.textarea, error && styles.textareaError, className]
            .filter(Boolean)
            .join(' ')}
        />

        <span
          id={errorId}
          className={`${styles.error} ${error ? styles.errorVisible : ''}`}
        >
          {error || ''}
        </span>
      </div>
    );
  },
);
