import { NavLink, useNavigate } from 'react-router';

import { ROUTES } from '../../../app/paths';
import { useAuth } from '../../../features/auth/AuthContext';

import styles from './Sidebar.module.css';

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside className={styles.sidebar}>
      <NavLink to={ROUTES.currencies} className={styles.logo}>
        💰
      </NavLink>

      <nav className={styles.navigation}>
        <NavLink
          to={ROUTES.currencies}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>💱</span>
          <span className={styles.label}>Rates</span>
        </NavLink>

        <NavLink
          to={ROUTES.card}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📋</span>
          <span className={styles.label}>Cards</span>
        </NavLink>
      </nav>

      <button type="button" className={styles.logout} onClick={handleLogout}>
        <span className={styles.icon}>🚪</span>
        <span className={styles.label}>Logout</span>
      </button>
    </aside>
  );
}
