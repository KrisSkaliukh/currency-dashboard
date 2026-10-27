import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MOCK_CREDENTIALS } from './constants';
import { clearStoredUser, getStoredUser, setStoredUser } from './storage';
import type { LoginFormValues } from './schema';

import type { AuthUserType } from '../../shared/types';

type AuthContextValue = {
  user: AuthUserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    values: LoginFormValues,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (values: LoginFormValues) => {
    await new Promise(r => setTimeout(r, 400));

    const emailMatch =
      values.email.trim().toLowerCase() === MOCK_CREDENTIALS.email;
    const passwordMatch = values.password === MOCK_CREDENTIALS.password;

    if (!emailMatch || !passwordMatch) {
      return { ok: false as const, message: 'Incorrect email or password' };
    }

    const nextUser: AuthUserType = { email: MOCK_CREDENTIALS.email };
    setStoredUser(nextUser);
    setUser(nextUser);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
