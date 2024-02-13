import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DataLengthProvider } from 'context/Context';
import AppTopbar from './AppTopbar';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

function MainLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return (
    <DataLengthProvider>
      <div
        className='flex min-h-screen w-full'
        style={{ backgroundColor: '#eff3f8' }}
      >
        {sidebarVisible && <AppSidebar />}
        <div className='min-h-screen flex flex-column w-full py-3 px-5'>
          <AppTopbar
            onToggleSidebar={toggleSidebar}
            className='flex-grow-0'
          />
          <main className=''>
            <section>
              <Outlet />
            </section>
          </main>
          {/* <AppFooter /> */}
        </div>
      </div>
    </DataLengthProvider>
  );
}

export default MainLayout;
