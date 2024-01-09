import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

import AppTopbar from './AppTopbar';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

function MainLayout() {
  return (
    <div className={`${styles.wrap} min-h-screen p-3`}>
      <AppTopbar />
      <div className='flex'>
        <AppSidebar />
        <main className='flex flex-grow-1 flex-column gap-2'>
          <Outlet />
        </main>
      </div>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
