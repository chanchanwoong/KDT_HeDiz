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
    // <div
    //   className='min-h-screen p-3 flex flex-column gap-2'
    //   style={{ backgroundColor: '#eff3f8' }}
    // >
    //   <AppTopbar onToggleSidebar={toggleSidebar} />
    //   <main className='flex gap-2'>
    //     {sidebarVisible && <AppSidebar />}
    //     <section className='flex flex-grow-1 flex-column gap-2'>
    //       <Outlet />
    //     </section>
    //   </main>
    //   <AppFooter />
    // </div>
    <div
      className='flex min-h-screen w-full'
      style={{ backgroundColor: '#eff3f8' }}
    >
      {sidebarVisible && <AppSidebar />}
      <div className='min-h-screen flex flex-column gap-2 w-full'>
        <AppTopbar onToggleSidebar={toggleSidebar} />
        <main className='flex gap-2 p-4'>
          {/* {sidebarVisible && <AppSidebar />} */}
          <section className='flex flex-grow-1 flex-column gap-2'>
            <Outlet />
          </section>
        </main>
        {/* <AppFooter /> */}
      </div>
    </div>
  );
}

export default MainLayout;
