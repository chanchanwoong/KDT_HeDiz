import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const ChangePasswordDialog = ({ visible, onHide, onSubmit, onCancelClick }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  return (
    <Dialog
      header='비밀번호 변경'
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
            name='shop_pw'
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
            name='new_pw'
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
            name='new_pw_check'
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
  );
};

export default ChangePasswordDialog;
