import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

function AuthLayout() {
  return (
    <div className={`flex justify-content-center align-items-center ${styles.wrap}`}>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
