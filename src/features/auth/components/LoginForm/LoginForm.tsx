import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router';

import { useAuth } from '../../AuthContext';
import { loginSchema, type LoginFormValues } from '../../../auth/schema';

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
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.titleBlock}>
          <h1>Log in</h1>
          <p>Welcome Back</p>
        </div>

        {serverError && (
          <p className={styles.serverError} role="alert">
            {serverError}
          </p>
        )}

        <input
          type="email"
          autoComplete="email"
          placeholder="✉️ Email Address"
          className={errors.email ? styles.inputError : undefined}
          {...register('email')}
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}

        <input
          type="password"
          autoComplete="current-password"
          placeholder="🔒 Password"
          className={errors.password ? styles.inputError : undefined}
          {...register('password')}
        />
        {errors.password && (
          <span className={styles.fieldError}>{errors.password.message}</span>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
