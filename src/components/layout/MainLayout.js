import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppTopbar from './AppTopbar';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

function MainLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return (
    <div
      className='min-h-screen p-3 flex flex-column gap-2'
      style={{ backgroundColor: '#eff3f8' }}
    >
      <AppTopbar onToggleSidebar={toggleSidebar} />
      <main className='flex gap-2'>
        {sidebarVisible && <AppSidebar />}
        <section className='flex flex-grow-1 flex-column gap-2'>
          <Outlet />
        </section>
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
