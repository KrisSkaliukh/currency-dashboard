import { Navigate, Route, Routes } from 'react-router';

import { CardFormPage } from '../pages/CardFormPage/CardFormPage';
import { CurrenciesPage } from '../pages/CurrenciesPage/CurrenciesPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { ROUTES } from './paths';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />

      <Route path={ROUTES.currencies} element={<CurrenciesPage />} />
      <Route path={ROUTES.card} element={<CardFormPage />} />

      <Route path="/" element={<Navigate to={ROUTES.currencies} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.currencies} replace />} />
    </Routes>
  );
}
