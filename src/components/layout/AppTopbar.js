import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { authAxios } from 'api/AxiosAPI';
import { useDataLength } from 'context/Context';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import RealtimeReservationDialog from 'components/common/RealTimeReservationDialog';

export default function AppTopbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  // const [dataLength, setDataLength] = useState(0);
  const { dataLength, setDataLength } = useDataLength();

  const defaultValues = {
    before_password: '',
    after_password: '',
    after_password_check: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm();

  const onCancelClick = () => {
    reset(defaultValues);
    setVisible(false);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  const acceptFunc = (msg, logout = false) => {
    console.log(msg, logout);
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: msg,
      life: 1000,
    });

    if (logout) {
      setTimeout(() => {
        localStorage.clear();
        navigate('/auth/sign-in');
      }, 1000);
    }
  };

  const rejectFunc = (msg) => {
    toast.current.show({
      severity: 'warn',
      summary: 'Cancel',
      detail: msg,
      life: 3000,
    });
  };

  // 비밀번호 변경
  const onSubmit = async (data) => {
    const authData = {
      before_password: data.before_password,
      after_password: data.after_password,
      after_password_check: data.after_password_check,
    };

    if (data.after_password !== data.after_password_check) {
      setError('after_password_check', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    console.log('authData >> ', authData);

    authAxios()
      .post(`/home/mypage/${localStorage.getItem('shop_seq')}`, authData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        if (response.data === false) {
          rejectFunc('비밀번호 변경을 실패하였습니다.');
          reset(defaultValues);
        } else {
          acceptFunc('비밀번호를 변경하였습니다.');
          reset(defaultValues);
        }
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
    setVisible(false);
  };

  // 로그아웃
  const handleSignOut = () => {
    confirmDialog({
      message: '정말 로그아웃 하시겠습니까?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: acceptFunc,
      reject: rejectFunc,
    });
  };
  // 모달창 띄우기 위한 함수들
  const handleButtonClick = () => {
    setIsDialogVisible(true);
  };

  const handleCloseModal = () => {
    setIsDialogVisible(false);
  };

  const start = (
    <Button
      onClick={onToggleSidebar}
      className='p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200'
    >
      <i className='pi pi-bars text-xl text-color'></i>
    </Button>
  );
  const end = (
    <nav className='flex align-items-center justify-content-between gap-4'>
      <Tooltip
        target='.realtimeReservation'
        mouseTrack
        mouseTrackLeft={10}
      />

      {/*   헤더에있는 금일 예약 버튼 캘린더 리스트 띄우기 */}
      <div>
        <div
          data-pr-tooltip='실시간 예약'
          className='realtimeReservation p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200'
          onClick={handleButtonClick}
        >
          <i className='pi pi-bell p-overlay-badge text-xl text-color'>
            <Badge
              value={dataLength}
              style={{
                background: '#8b5cf6',
                color: '#fff',
              }}
            ></Badge>
          </i>
        </div>

        <RealtimeReservationDialog
          isOpen={isDialogVisible}
          onClose={handleCloseModal}
          title='실시간 예약'
        />
      </div>

      {/* 비밀번호 변경 */}
      <Button
        onClick={() => setVisible(true)}
        tooltip='비밀번호 변경'
        tooltipOptions={{
          position: 'bottom',
          mouseTrack: true,
          mouseTrackTop: 15,
        }}
        className='p-link inline-flex justify-content-center align-items-center h-3rem w-3rem border-circle hover:bg-indigo-100 transition-all transition-duration-200'
      >
        <i className='pi pi-user-edit text-xl text-color'></i>
      </Button>
      {/* 로그아웃  */}
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
        <i className='pi pi-sign-out text-xl text-color'></i>
      </Button>
    </nav>
  );

  return (
    <header>
      <Menubar
        start={start}
        end={end}
        className='mb-4 flex justify-content-between border-noround border-none '
        style={{ background: 'none' }}
      />
      <Dialog
        header='비밀번호 변경'
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '30vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          method='post'
          className='flex flex-column flex-wrap gap-4'
        >
          <div className='flex flex-column gap-2'>
            <Controller
              name='before_password'
              control={control}
              rules={{ required: '비밀번호를 입력해주세요' }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    id={field.name}
                    value={field.value || ''}
                    placeholder='현재 비밀번호'
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    feedback={false}
                    onChange={field.onChange}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className='flex flex-column gap-2'>
            <Controller
              name='after_password'
              control={control}
              rules={{ required: '변경할 비밀번호를 입력해주세요' }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    id={field.name}
                    value={field.value || ''}
                    placeholder='변경 비밀번호'
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    feedback={false}
                    onChange={field.onChange}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className='flex flex-column gap-2'>
            <Controller
              name='after_password_check'
              control={control}
              rules={{ required: '변경할 비밀번호를 확인해주세요' }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    id={field.name}
                    value={field.value || ''}
                    placeholder='변경 비밀번호 확인'
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    feedback={false}
                    onChange={field.onChange}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className='flex justify-content-end gap-2'>
            <Button
              label='취소'
              type='button'
              onClick={onCancelClick}
              size='small'
              className='w-6rem'
              outlined
            />
            <Button
              label='변경'
              type='submit'
              size='small'
              className='w-6rem'
            />
          </div>
        </form>
      </Dialog>
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
                  acceptFunc('로그아웃을 진행합니다.', true);
                }}
                className='w-8rem'
              ></Button>
              <Button
                label='아니요'
                outlined
                onClick={(event) => {
                  hide(event);
                  rejectFunc('로그아웃을 취소했습니다.');
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
