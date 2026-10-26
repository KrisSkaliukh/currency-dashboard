import { Navigate, Route, Routes } from 'react-router';

import { GuestRoute } from '../features/auth/GuestRoute';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { CardFormPage } from '../pages/CardFormPage/CardFormPage';
import { CurrenciesPage } from '../pages/CurrenciesPage/CurrenciesPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { ROUTES } from './paths';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.currencies} element={<CurrenciesPage />} />
        <Route path={ROUTES.card} element={<CardFormPage />} />
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.currencies} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.currencies} replace />} />
    </Routes>
  );
}
