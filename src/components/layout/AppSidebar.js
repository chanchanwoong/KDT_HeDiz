import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';

function AppSidebar() {
  const navigate = useNavigate;

  const itemRenderer = (item) => (
    <div className='p-menuitem-content'>
      <Link
        to={item.url}
        className='flex align-items-center p-menuitem-link ml-2'
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

  let items = [
    {
      template: () => {
        return (
          <span className='inline-flex align-items-center gap-1 px-2 py-2'>
            <span className='font-medium text-xl font-semibold'>
              He<span className='text-primary'>DIz</span>
            </span>
          </span>
        );
      },
    },

    {
      separator: true,
    },
    {
      // command: () => {
      //   toast.current.show({
      //     severity: 'info',
      //     summary: 'Info',
      //     detail: 'Item Selected',
      //     life: 3000,
      //   });
      // },
      template: (item, options) => {
        return (
          <a href='/home/mypage'>
            <button
              className={
                'w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround'
              }
            >
              <div className='flex flex-column align'>
                <span className='font-bold'>이가희</span>
                <span className='text-sm'>디자이너</span>
              </div>
            </button>
          </a>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: '바로가기',
      items: [
        // {
        //   label: '대시보드',
        //   icon: 'pi pi-th-large',
        //   url: 'home/dashboard',
        //   template: itemRenderer,
        // },
        {
          label: '실시간 예약',
          icon: 'pi pi-bell',
          url: 'home/realtime-reservation',
          badge: 16,
          template: itemRenderer,
        },
      ],
    },
    {
      label: '예약 관리',
      items: [
        {
          label: '전체 예약 내역',
          icon: 'pi pi-calendar',
          url: 'reservation/total',
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
          label: '쿠폰 발급',
          icon: 'pi pi-gift',
          url: 'customer/coupon',
          template: itemRenderer,
        },
      ],
    },
  ];

  return (
    <article className='card flex sidebar'>
      <Menu
        model={items}
        className='w-full md:w-15rem'
      />
    </article>
  );
}

export default AppSidebar;
