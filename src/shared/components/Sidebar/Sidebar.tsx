import { NavLink, useNavigate } from 'react-router';

import { ROUTES } from '../../../app/paths';
import { useAuth } from '../../../features/auth/AuthContext';

import styles from './Sidebar.module.css';

function DashboardMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10M7 17h10M4 10l-3-3 3-3M20 14l3 3-3 3" />
      <path d="M1 7h15M8 17H23" />
    </svg>
  );
}

function RatesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h13m0 0-3-3m3 3-3 3M17 17H4m0 0 3 3m-3-3 3-3" />
    </svg>
  );
}

function CardsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h8M8 17h4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
      <path d="M14 16l4-4-4-4m4 4H9" />
    </svg>
  );
}

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <NavLink
        to={ROUTES.currencies}
        className={styles.brand}
        aria-label="Currency dashboard"
      >
        <span className={styles.brandMark}>
          <DashboardMark />
        </span>
        <span className={styles.brandName}>Dashboard</span>
      </NavLink>

      <nav className={styles.navigation} aria-label="Primary">
        <span className={styles.sectionLabel}>Menu</span>
        <NavLink
          to={ROUTES.currencies}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <RatesIcon />
          <span className={styles.label}>Exchange Rates</span>
        </NavLink>

        <NavLink
          to={ROUTES.card}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <CardsIcon />
          <span className={styles.label}>Kanban Cards</span>
        </NavLink>
      </nav>

      <button type="button" className={styles.logout} onClick={handleLogout}>
        <LogoutIcon />
        <span className={styles.label}>Logout</span>
      </button>
    </aside>
  );
}
