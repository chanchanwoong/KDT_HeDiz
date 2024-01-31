import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from 'components/Logo';
import { TabMenu } from 'primereact/tabmenu';

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: '홈', to: '/' },
    { label: '예약확인', to: '/reservation' },
    { label: '마이페이지', to: '/mypage' },
  ];

  const activeIndex = items.findIndex((item) => item.to === location.pathname);
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <div className='wrapper'>
      <header>
        <Logo
          spacing='py-3'
          size='text-2xl'
        />
        {!isAuthPage && (
          <TabMenu
            model={items.map((item) => ({
              label: item.label,
              command: () => navigate(item.to),
            }))}
            activeIndex={activeIndex}
          />
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
