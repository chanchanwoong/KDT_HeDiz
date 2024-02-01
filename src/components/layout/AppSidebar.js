import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'components/common/Logo';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
function AppSidebar() {
  const itemRenderer = (item) => (
    <div className='p-menuitem-content'>
      <Link
        to={item.url}
        className='flex align-items-center p-menuitem-link ml-3 my-1'
      >
        <span className={item.icon} />
        <span className='mx-2'>{item.label}</span>
        {item.badge && (
          <Badge
            className='ml-auto'
            value={item.badge}
          />
        )}
      </Link>
    </div>
  );

  let menu = [
    {
      template: () => {
        return (
          <div className='flex align-items-center justify-content-center h-4rem px-4 py-6'>
            <Logo size='text-2xl' />
          </div>
        );
      },
    },
    // {
    //   label: '바로가기',
    //   items: [
    //     {
    //       label: '대시보드',
    //       icon: 'pi pi-th-large',
    //       url: '/',
    //       template: itemRenderer,
    //     },
    //   ],
    // },
    {
      label: '예약 관리',
      items: [
        {
          label: '금일 예약',
          icon: 'pi pi-bell',
          url: 'home/realtime-reservation',
          // badge: 16,
          template: itemRenderer,
        },
        {
          label: '전체 예약 내역',
          icon: 'pi pi-calendar',
          url: 'reservation/total',
          template: itemRenderer,
        },
      ],
    },
    {
      label: '미용실 관리',
      items: [
        {
          label: '미용실 정보',
          icon: 'pi pi-id-card',
          url: 'hairshop/info',
          template: itemRenderer,
        },
        {
          label: '헤어스타일',
          icon: 'pi pi-inbox',
          url: 'hairshop/hairstyle',
          template: itemRenderer,
        },
        {
          label: '직원 관리',
          icon: 'pi pi-users',
          url: 'hairshop/staff',
          template: itemRenderer,
        },
        {
          label: '임시 휴무일',
          icon: 'pi pi-calendar-plus',
          url: 'hairshop/closed-day',
          template: itemRenderer,
        },
      ],
    },

    {
      label: '고객 관리',
      items: [
        {
          label: '고객 방문 이력',
          icon: 'pi pi-heart',
          url: 'customer/management',
          template: itemRenderer,
        },
        {
          label: '리뷰 관리',
          icon: 'pi pi-star',
          url: 'reservation/review',
          template: itemRenderer,
        },
      ],
    },
  ];

  return (
    <article className='flex sidebar'>
      <Menu
        model={menu}
        className='w-full md:w-18rem border-noround '
      />
    </article>
  );
}

export default AppSidebar;
