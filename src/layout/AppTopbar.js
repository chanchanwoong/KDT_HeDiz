import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TabMenu } from 'primereact/tabmenu';
import Logo from '../components/common/Logo';

export default function AppTopbar() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const items = [
    { label: '홈', icon: 'pi pi-home', url: '/'},
    { label: '내 주변', icon: 'pi pi-chart-line', url:'/near' },
    { label: '예약', icon: 'pi pi-list', url:'/reservation' },
    { label: '마이페이지', icon: 'pi pi-inbox', url:'/mypage' },
  ];

  return (
    <header>
      <Logo />
      <div className='card '>
        <TabMenu model={items} />
      </div>
    </header>
  );
}
