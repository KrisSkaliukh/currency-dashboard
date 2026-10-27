import { Navigate, Outlet } from 'react-router';

import { useAuth } from './AuthContext';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/currencies" replace />;
  }

  return <Outlet />;
}
