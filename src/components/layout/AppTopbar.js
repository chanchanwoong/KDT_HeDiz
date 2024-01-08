import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import Logo from 'components/common/Logo';

export default function AppTopbar() {
  const itemRenderer = (item) => (
    <a className='flex align-items-center p-menuitem-link'>
      <span className={item.icon} />
      <span className='mx-2'>{item.label}</span>
      {item.badge && (
        <Badge
          className='ml-auto'
          value={item.badge}
        />
      )}
      {item.shortcut && (
        <span className='ml-auto border-1 surface-border border-round surface-100 text-xs p-1'>
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items = [
    {
      // label: 'Contact',
      icon: 'pi pi-bell',
      badge: 2,
      template: itemRenderer,
    },
    {
      // label: 'Features',
      icon: 'pi pi-window-maximize',
    },
    {
      // label: 'Home',
      icon: 'pi pi-language',
    },
    {
      // label: 'Home',
      icon: 'pi pi-ellipsis-v',
    },
    // {
    //   label: 'Projects',
    //   icon: 'pi pi-ellipsis-v',
    //   items: [
    //     {
    //       label: 'Core',
    //       icon: 'pi pi-bolt',
    //       shortcut: '⌘+S',
    //       template: itemRenderer,
    //     },
    //     {
    //       label: 'Blocks',
    //       icon: 'pi pi-server',
    //       shortcut: '⌘+B',
    //       template: itemRenderer,
    //     },
    //     {
    //       label: 'UI Kit',
    //       icon: 'pi pi-pencil',
    //       shortcut: '⌘+U',
    //       template: itemRenderer,
    //     },
    //   ],
    // },
  ];

  const start = <Logo />;

  return (
    <div className='card'>
      <Menubar
        className='bg-white mb-3 flex justify-content-between'
        model={items}
        start={start}
      />
    </div>
  );
}
