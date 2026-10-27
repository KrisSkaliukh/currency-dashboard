import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export function Button({
  children,
  type = 'button',
  fullWidth = true,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[styles.button, fullWidth && styles.fullWidth, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
