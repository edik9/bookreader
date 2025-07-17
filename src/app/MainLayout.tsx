import { Outlet } from "react-router-dom";
import { Header, Sidebar, SyncStatusBadge } from '@/shared/components'
// import styles from './MainLayout.module.scss'

export const MainLayout = () => {
  return (
    <div>
      <Header />
      <div>
        <Sidebar />
        <main>
          <Outlet />
          <SyncStatusBadge />
        </main>
      </div>
    </div>
  )
}