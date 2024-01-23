import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import Logo from '../components/common/Logo';
import { Link } from 'react-router-dom';

export default function AppTopbar() {
  const items = [
    { label: '홈', icon: 'pi pi-home', url: '/' },
    { label: '예약 확인', icon: 'pi pi-list', url: '/reservation' },
    { label: '마이페이지', icon: 'pi pi-inbox', url: '/mypage' },
  ];

  const menuItems = items.map((item) => ({
    ...item,
    template: <Link to={item.url}>{item.label}</Link>,
  }));

  return (
    <div className='card'>
      <Logo />
      <TabMenu model={menuItems} />
    </div>
  );
}
