import { Outlet } from 'react-router';

import { Sidebar } from '../shared/components/Sidebar/Sidebar';

import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
