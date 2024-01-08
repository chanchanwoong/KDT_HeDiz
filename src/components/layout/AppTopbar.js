import React from 'react';
import { Menubar } from 'primereact/menubar';
import Logo from 'components/common/Logo';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import styles from './AppTopbar.module.css';

export default function AppTopbar() {
  const items = [
    {
      icon: 'pi pi-home',
    },
    {
      label: '실시간 예약',
      icon: 'pi pi-star',
    },
    {
      label: '마이페이지',
      icon: 'pi pi-search',
      items: [
        {
          label: 'Components',
          icon: 'pi pi-bolt',
        },
        {
          label: 'Blocks',
          icon: 'pi pi-server',
        },
        {
          label: 'UI Kit',
          icon: 'pi pi-pencil',
        },
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
            },
          ],
        },
      ],
    },
  ];

  return (
    <header className='px-4 py-2 mb-3 flex align-items-center'>
      <Logo />
      {/* <Menubar
        model={items}
        className='ml-auto'
      /> */}
      <>
        <nav className='flex flex-wrap justify-content-center align-items-center gap-2 ml-auto'>
          <Avatar
            image='https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
            shape='circle'
          />
          <span>이가희</span>님, 안녕하세요
          <Button
            icon='pi pi-bell'
            rounded
            text
            severity='warning'
            aria-label='Notification'
          />
          <Button
            icon='pi pi-window-maximize'
            rounded
            text
          />
          <Button
            icon='pi pi-language'
            rounded
            text
            severity='success'
          />
          <Button
            icon='pi pi-ellipsis-v'
            rounded
            text
            severity='secondary'
          />
        </nav>
      </>
    </header>
  );
}
