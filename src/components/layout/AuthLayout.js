import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <>
      <h1>인증 레이아웃</h1>
      <Outlet />
    </>
  );
}

export default AuthLayout;
