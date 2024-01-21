import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

import AppTopbar from './AppTopbar';
import ReservationButton from '../components/common/ReservationButton';

function MainLayout() {
  return (
    <div
      className={styles.wrap}
      // className='flex flex-col min-h-screen w-4'
      style={{ backgroundColor: '#eff3f8' }}
    >
      <AppTopbar />
      <Outlet />
      <ReservationButton />
    </div>
  );
}

export default MainLayout;
