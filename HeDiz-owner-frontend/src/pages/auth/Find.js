import { useState, useRef } from 'react';
import { nonAuthAxios } from 'api/AxiosAPI';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import Logo from 'components/common/Logo';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';
import { TabPanel, TabView } from 'primereact/tabview';
import { useNavigate } from 'react-router';
import { Password } from 'primereact/password';

function Find() {
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
      shop_register: '',
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
      shop_register: data.shop_register,
      // cust_phone: data.cust_phone,
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
            shop_register: '',
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
      shop_id: data.shop_id,
      shop_name: data.shop_name,
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
            shop_id: '',
            shop_name: '',
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
      shop_pw: data.shop_pw,
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
    <main className='flex flex-column bg-white p-6 w-4 border-round-lg'>
      <Logo
        size='text-4xl'
        margin='mb-6'
      />
      <TabView className='w-full'>
        {/*//////////////////////////     아이디 찾기     ////////////////////////////////////////*/}
        <TabPanel header='아이디 찾기'>
          <form
            onSubmit={handleSubmit(onIDSubmit)}
            method='post'
            className='flex flex-column flex-wrap gap-4 mb-4'
          >
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                사업자등록번호
              </span>
              <Controller
                name='shop_register'
                control={control}
                rules={{ required: '사업자등록번호를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value}
                      placeholder='사업자등록번호를 입력해주세요'
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
            {findResultID === '' ? null : <p>아이디 : {findResultID} </p>}
            <Button
              label='아이디 찾기'
              type='submit'
              className='btn__submit mt-4'
            />
          </form>
          <Toast ref={toast} />
        </TabPanel>
        {/*//////////////////////////     비밀번호 찾기     ////////////////////////////////////////*/}
        <TabPanel header='비밀번호 변경'>
          <form
            onSubmit={handleSubmit(onPasswordSubmit)}
            method='post'
            className='flex flex-column flex-wrap gap-4'
          >
            <div className='flex flex-column gap-2'>
              <span className='text-color-secondary pl-1 font-semibold'>
                아이디
              </span>
              <Controller
                name='shop_id'
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
                name='shop_name'
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
              className='mt-4'
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
                  name='shop_pw'
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
            // position='bottom-center'
          />
        </TabPanel>
      </TabView>
      <Button
        type='button'
        severity='help'
        outlined
      >
        <Link
          to='/auth/sign-in'
          className='text-purple-500 font-semibold cursor-pointer no-underline w-full'
        >
          로그인페이지
        </Link>
      </Button>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1600 800'
        className='fixed left-0 top-0 min-h-screen min-w-screen'
        preserveAspectRatio='none'
        style={{ zIndex: '-1' }}
      >
        <rect
          fill='var(--primary-500)'
          width='1600'
          height='800'
        ></rect>
        <path
          fill='var(--primary-300)'
          d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'
        ></path>
        <path
          fill='var(--primary-200)'
          d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'
        ></path>
      </svg>
    </main>
  );
}

export default Find;
