import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div
      className={
        'flex justify-content-center align-items-center min-h-screen h-screen'
      }
    >
      <Outlet />
    </div>
  );
}

export default AuthLayout;
