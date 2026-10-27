import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router';

import { useAuth } from '../../AuthContext';
import { loginSchema, type LoginFormValues } from '../../../auth/schema';
import { Input } from '../../../../shared/components/Input/Input';
import { Button } from '../../../../shared/components/Button/Button';

import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from ?? '/currencies';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await login(values);
    if (!result.ok) {
      setServerError(result.message);
      return;
    }
    navigate(from, { replace: true });
  });

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="login-title"
      >
        <div className={styles.titleBlock}>
          <span className={styles.brandMark} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 7h10M7 17h10M4 10 1 7l3-3M20 14l3 3-3 3" />
              <path d="M1 7h15M8 17h15" />
            </svg>
          </span>
          <h1 id="login-title" className={styles.title}>
            Log in
          </h1>
          <p className={styles.subtitle}>Welcome Back</p>
        </div>

        <div className={styles.inputBlock}>
          <div className={styles.inputWithIcon}>
            <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <Input
              type="email"
              autoComplete="email"
              aria-label="Email address"
              placeholder="Email Address"
              className={styles.authInput}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className={styles.inputWithIcon}>
            <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3" />
            </svg>
            <Input
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              placeholder="Password"
              className={styles.authInput}
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>

        {serverError && (
          <p className={styles.serverError} role="alert">
            {serverError}
          </p>
        )}
      </form>
    </div>
  );
}
