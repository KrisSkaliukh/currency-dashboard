import { useNavigate } from 'react-router';

import { useAuth } from '../../features/auth/AuthContext';
import { ROUTES } from '../../app/paths';

export function CurrenciesPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <main>
      <p>Exchange rates</p>
      <button onClick={handleLogout}>logout</button>
    </main>
  );
}
