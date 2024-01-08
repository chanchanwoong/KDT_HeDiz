import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <h1>메인 레이아웃</h1>
      <Outlet />
    </>
  );
}

export default MainLayout;
