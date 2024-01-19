import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

export default function AppTopbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Good Bye',
      detail: '로그아웃을 진행합니다.',
      life: 1000,
    });

    setTimeout(() => {
      localStorage.clear();
      navigate('/auth/sign-in');
    }, 1000);
  };

  const reject = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Cancel',
      detail: '로그아웃을 취소했습니다.',
      life: 3000,
    });
  };

  const handleSignOut = () => {
    confirmDialog({
      message: '정말 로그아웃 하시겠습니까?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept,
      reject,
    });
  };

  const start = (
    <Button
      onClick={onToggleSidebar}
      className='p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200'
    >
      <i className='pi pi-bars text-2xl text-color'></i>
    </Button>
  );
  const end = (
    <div className='flex flex-wrap align-items-center justify-content-between gap-3'>
      <nav>
        <Tooltip
          target='.realtimeReservation'
          mouseTrack
          mouseTrackLeft={10}
        />
        <Link
          to='/home/realtime-reservation'
          data-pr-tooltip='실시간 예약'
          className='realtimeReservation p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200 mr-5'
        >
          <i className='pi pi-bell p-overlay-badge text-2xl text-color'>
            <Badge
              value='16'
              style={{
                background: '#8b5cf6',
                color: '#fff',
              }}
            ></Badge>
          </i>
        </Link>
        <Tooltip
          target='.signOut'
          mouseTrack
          mouseTrackLeft={10}
        />
        <Button
          onClick={handleSignOut}
          tooltip='로그아웃'
          tooltipOptions={{
            position: 'bottom',
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          className='p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200'
        >
          <i className='pi pi-sign-out text-2xl text-color'></i>
        </Button>
      </nav>
    </div>
  );

  return (
    <header>
      <Menubar
        start={start}
        end={end}
        className='px-6 py-4 flex justify-content-between border-noround border-none '
        style={{ background: 'none' }}
      />
      <ConfirmDialog
        group='headless'
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className='flex flex-column align-items-center p-5 surface-overlay border-round'>
            <div className='border-circle bg-primary inline-flex justify-content-center align-items-center h-5rem w-5rem'>
              <i className='pi pi-sign-out text-4xl'></i>
            </div>
            <span
              className='font-bold text-2xl block mb-2 mt-4'
              ref={headerRef}
            >
              {message.header}
            </span>
            <p
              className='mb-0'
              ref={contentRef}
            >
              {message.message}
            </p>
            <div
              className='flex align-items-center gap-2 mt-4'
              ref={footerRef}
            >
              <Button
                label='네'
                onClick={(event) => {
                  hide(event);
                  accept();
                }}
                className='w-8rem'
              ></Button>
              <Button
                label='아니요'
                outlined
                onClick={(event) => {
                  hide(event);
                  reject();
                }}
                className='w-8rem'
              ></Button>
            </div>
          </div>
        )}
      />
      <Toast ref={toast} />
    </header>
  );
}
