import { AUTH_STORAGE_KEY } from './constants';

import type { AuthUserType } from '../../shared/types';

export function getStoredUser(): AuthUserType | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUserType;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUserType): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
