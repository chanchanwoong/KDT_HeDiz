import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TabMenu } from 'primereact/tabmenu';
import Logo from '../components/common/Logo';

export default function AppTopbar() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const items = [
    { label: '홈', icon: 'pi pi-home' },
    { label: '내 주변', icon: 'pi pi-chart-line' },
    { label: '예약', icon: 'pi pi-list' },
    { label: '마이페이지', icon: 'pi pi-inbox' },
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
