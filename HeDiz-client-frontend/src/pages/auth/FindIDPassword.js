import { useState, useRef } from 'react';
import { nonAuthAxios } from 'api/AxiosAPI';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';
import { TabPanel, TabView } from 'primereact/tabview';
import { useNavigate } from 'react-router';
import { Password } from 'primereact/password';

function FindIDPassword() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [userid, setUserid] = useState('');
  const [findResultID, setFindResultID] = useState('');
  const [findResultPW, setFindResultPW] = useState('');
  const [isCheckedID, setIsCheckedID] = useState('');

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      cust_name: '',
      cust_phone: '',
    },
  });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  // 로그인
  const onIDSubmit = async (data) => {
    const authData = {
      cust_name: data.cust_name,
      cust_phone: data.cust_phone,
    };

    console.log('Non-Auth Request: ', authData);

    // [POST] 아이디 찾기
    nonAuthAxios()
      .post('/auth/find-id', authData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);
        if (response.data !== '') {
          setFindResultID(response.data);
        } else {
          showError();
          reset({
            cust_name: '',
            cust_phone: '',
          });
        }
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
      });
  };

  const onPasswordSubmit = async (data) => {
    const authData = {
      cust_name: data.cust_name,
      cust_id: data.cust_id,
    };
    setFindResultPW(authData);
    console.log('Non-Auth Request: ', authData);

    // [POST] 계정 정보 확인
    nonAuthAxios()
      .post('/auth/check-password', authData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);
        if (response.data === true) {
          setIsCheckedID(true);
        } else {
          showError();
          reset({
            cust_id: '',
            cust_name: '',
          });
        }
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
      });
  };
  // [PUT] 비밀번호 변경 하기
  const onPasswordChangeSubmit = async (data) => {
    const authData = {
      ...findResultPW,
      cust_pw: data.cust_pw,
    };

    console.log('Non-Auth Request: ', authData);

    nonAuthAxios()
      .put('/auth/change-password', authData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);
        showAccept();
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
        showError();
        reset({
          cust_id: '',
          cust_name: '',
        });
      });
  };

  const showAccept = () => {
    toast.current.show({
      severity: 'success',
      summary: '비밀번호 변경 성공',
      detail: '비밀번호가 변경되었습니다. 로그인 화면으로 돌아갑니다.',
      life: 3000,
    });

    setTimeout(() => {
      navigate('/auth/sign-in');
    }, 3000);
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: '아이디 찾기 실패 :(',
      detail: '해당 정보의 아이디가 없습니다. ',
      life: 3000,
    });
  };

  return (
    <>
      <TabView>
        {/*//////////////////////////     아이디 찾기     ////////////////////////////////////////*/}
        <TabPanel header='아이디 찾기'>
          <form
            onSubmit={handleSubmit(onIDSubmit)}
            method='post'
            className='flex flex-column flex-wrap gap-4 mb-4'
          >
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                이름
              </span>
              <Controller
                name='cust_name'
                control={control}
                rules={{ required: '이름을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value}
                      placeholder='이름을 입력해주세요'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserid(e.target.value);
                      }}
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                전화번호
              </span>
              <Controller
                name='cust_phone'
                control={control}
                rules={{ required: '전화번호를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputMask
                      id={field.name}
                      value={field.value || ''}
                      mask='999-9999-9999'
                      placeholder='전화번호를 입력해주세요'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            {findResultID === '' ? null : <p>아이디 : {findResultID} </p>}
            <div className='flex align-items-center justify-content-between mb-4'></div>
            <Button
              label='아이디 찾기'
              type='submit'
              className='btn__submit'
            />
          </form>
          <Toast
            ref={toast}
            position='bottom-center'
          />
        </TabPanel>
        {/*//////////////////////////     비밀번호 찾기     ////////////////////////////////////////*/}
        <TabPanel header='비밀번호 변경'>
          <form
            onSubmit={handleSubmit(onPasswordSubmit)}
            method='post'
            className='flex flex-column flex-wrap gap-4 mb-4'
          >
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                아이디
              </span>
              <Controller
                name='cust_id'
                control={control}
                rules={{ required: '아이디를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value}
                      placeholder='아이디를 입력해주세요'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserid(e.target.value);
                      }}
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                이름
              </span>
              <Controller
                name='cust_name'
                control={control}
                rules={{ required: '이름을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='이름을 입력해주세요'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <Button
              label='계정 정보 확인'
              type='submit'
            />
          </form>
          <div className='flex align-items-center justify-content-between mb-4'></div>
          {/*계정 정보가 있을경우 비밀번호 변경 창 생성 */}
          {!isCheckedID ? null : (
            <form
              onSubmit={handleSubmit(onPasswordChangeSubmit)}
              method='post'
              className='flex flex-column flex-wrap gap-4 mb-4'
            >
              <>
                <Controller
                  name='cust_pw'
                  control={control}
                  rules={{ required: '변경할 비밀번호를 입력해주세요' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Password
                        id={field.name}
                        value={field.value || ''}
                        placeholder='변경할 비밀번호를 입력해주세요'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                        onChange={field.onChange}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </>

              <Button
                label='비밀번호 변경'
                type='submit'
                className='btn__submit'
              />
            </form>
          )}

          <Toast
            ref={toast}
            position='bottom-center'
          />
        </TabPanel>
      </TabView>
    </>
  );
}

export default FindIDPassword;
