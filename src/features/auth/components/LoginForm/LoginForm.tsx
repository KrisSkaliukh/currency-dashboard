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
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Log in</h1>
          <p className={styles.subtitle}>Welcome Back</p>
        </div>

        <div className={styles.inputBlock}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="✉️  Email Address"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            type="password"
            autoComplete="current-password"
            placeholder="🔒  Password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>

        {serverError && <p className={styles.serverError}>{serverError}</p>}
      </form>
    </div>
  );
}
