import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { authAxios } from '../../api/AxiosAPI';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

function ChangePassword({ visible, onHide }) {
  const defaultValues = {
    before_phone: '',
    after_phone: '',
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const onCancelClick = () => {
    reset(defaultValues);
    onHide();
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

    try {
      const response = await authAxios().post(
        `/home/mypage/${localStorage.getItem('shop_seq')}`,
        authData
      );
      console.log('Auth Response:', response.data);
      onHide(); // 비밀번호 변경 후 다이얼로그를 닫습니다.
    } catch (error) {
      console.error('Auth Error:', error);
    }
  };

  return (
    <Dialog
      header='프로필 수정'
      visible={visible}
      onHide={onHide}
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
            name='before_phone'
            control={control}
            rules={{ required: '이전 전화번호를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  value={field.value || ''}
                  placeholder='이전 전화번호'
                  className={classNames({
                    'p-invalid': fieldState.error,
                  })}
                  feedback='false'
                  onChange={field.onChange}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </div>

        <div className='flex flex-column gap-2'>
          <Controller
            name='after_phone'
            control={control}
            rules={{ required: '바뀐 전화번호를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  value={field.value || ''}
                  placeholder='바뀐 전화번호'
                  className={classNames({
                    'p-invalid': fieldState.error,
                  })}
                  feedback='false'
                  onChange={field.onChange}
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
  );
}

export default ChangePassword;
