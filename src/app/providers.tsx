import React from 'react';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from '../features/auth/AuthContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
