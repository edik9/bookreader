import { Outlet } from 'react-router-dom';
import { Header, Sidebar, SyncStatusBadge } from '@/shared/components';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
          <SyncStatusBadge className={styles.syncBadge} />
        </main>
      </div>
    </div>
  );
};