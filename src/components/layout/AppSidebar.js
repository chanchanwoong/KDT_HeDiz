import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import Logo from 'components/common/Logo';
// import { axios } from 'axios';
import { authAxios } from 'api/AxiosAPI';

import { Menu } from 'primereact/menu';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function AppSidebar() {
  const [visible, setVisible] = useState(false);

  const defaultValues = {
    value: '',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
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

  const onSubmit = async (data) => {
    const authData = {
      before_password: data.before_password,
      after_password: data.after_password,
    };

    console.log('authData >> ', authData);

    authAxios()
      .post(`/home/mypage/${localStorage.getItem('shop_seq')}`, authData)
      .then((response) => {
        console.log('Auth Response:', response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
    // try {
    //   const response = await axios.post(
    //     `http://localhost:8080/mypage/${localStorage.getItem('shop_seq')}`,
    //     authData,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   );

    //   console.log('Server response:', response.data);

    //   navigate('/');
    // } catch (error) {
    //   console.error('Error during signup:', error);
    // }
  };

  const footerContent = (
    <div>
      <Button
        label='No'
        icon='pi pi-times'
        onClick={() => setVisible(false)}
        className='p-button-text'
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

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

  let menu = [
    {
      template: () => {
        return (
          <div className='h-4rem'>
            <Logo />
          </div>
        );
      },
    },
    {
      separator: true,
    },
    {
      template: () => {
        return (
          <div className='flex flex-column align gap-4 px-4 py-3'>
            <p className='font-bold text-lg text-center m-0'>
              {localStorage.getItem('shop_name')}
            </p>
            <Button
              label='비밀번호 변경'
              icon='pi pi-user-edit'
              onClick={() => setVisible(true)}
              size='small'
              severity='secondary'
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
                    rules={{ required: '비밀번호를 입력해주세요' }}
                    render={({ field, fieldState }) => (
                      <>
                        <Password
                          id={field.name}
                          value={field.value || ''}
                          placeholder='비밀번호'
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
                    rules={{ required: '비밀번호를 확인해주세요' }}
                    render={({ field, fieldState }) => (
                      <>
                        <Password
                          id={field.name}
                          value={field.value || ''}
                          placeholder='비밀번호'
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
          </div>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: '바로가기',
      items: [
        {
          label: '대시보드',
          icon: 'pi pi-th-large',
          url: '/',
          template: itemRenderer,
        },
      ],
    },
    {
      label: '예약 관리',
      items: [
        {
          label: '실시간 예약',
          icon: 'pi pi-bell',
          url: 'home/realtime-reservation',
          badge: 16,
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
        model={menu}
        className='w-full md:w-15rem border-noround'
      />
    </article>
  );
}

export default AppSidebar;
