import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

import AppTopbar from './AppTopbar';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

import { BreadCrumb } from 'primereact/breadcrumb';

function MainLayout() {
  const items = [{ label: '1depth' }, { label: '2depth' }];
  const home = { icon: 'pi pi-home', url: '/hairshop' };

  return (
    <div className={`${styles.wrap} min-h-screen p-3 flex flex-column gap-2`}>
      <AppTopbar />
      <main className='flex gap-2'>
        <AppSidebar />
        <section className='flex flex-grow-1 flex-column gap-2'>
          <BreadCrumb
            model={items}
            home={home}
          />
          <Outlet />
        </section>
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
