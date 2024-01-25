import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Controller, useForm } from 'react-hook-form';
import { nonAuthAxios } from 'api/AxiosAPI';
import Logo from 'components/common/Logo';

import { Link, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function SignIn() {
  const [cookies, setCookie, removeCookie] = useCookies(['rememberUserId']);
  const [userid, setUserid] = useState('');
  const [isRemember, setIsRemember] = useState(false);
  const toast = useRef(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      shop_id: cookies.rememberUserId || '',
      shop_pw: '',
    },
  });

  const navigate = useNavigate();

  // 쿠키에 아이디값 저장
  const handleOnChange = (e) => {
    setIsRemember(e.target.checked);
    if (!e.target.checked) {
      removeCookie('rememberUserId');
    } else {
      // 5일 저장
      setCookie('rememberUserId', userid, { maxAge: 5 * (60 * 60 * 24) });
    }
  };

  const onSubmit = async (data) => {
    const authData = {
      shop_id: data.shop_id,
      shop_pw: data.shop_pw,
    };

    console.log('Non-Auth Request: ', authData);

    // [POST] 로그인
    nonAuthAxios()
      .post('/auth/sign-in', authData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);
        const resData = response.data;
        const jwtToken = resData.jwtauthtoken;
        const shopSeq = resData.shop_seq;
        const shopName = resData.shop_name;

        localStorage.setItem('jwtauthtoken', jwtToken);
        localStorage.setItem('shop_seq', shopSeq);
        localStorage.setItem('shop_name', shopName);

        if (isRemember) {
          setCookie('rememberUserId', data.shop_id, {
            maxAge: 5 * (60 * 60 * 24),
          });
        } else {
          removeCookie('rememberUserId');
        }
        navigate('/');
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
        showError();
        reset({
          // shop_id: '',
          shop_pw: '',
        });
      });
  };

  useEffect(() => {
    if (cookies.rememberUserId !== undefined) {
      setUserid(cookies.rememberUserId);
      setIsRemember(true);
    }
  }, [cookies.rememberUserId]);

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: '로그인 실패 :(',
      detail: '아이디 또는 비밀번호가 올바르지 않습니다. ',
      life: 3000,
    });
  };

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo
        size='text-4xl'
        margin='mb-6'
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        method='post'
        className='flex flex-column flex-wrap gap-4 mb-4'
      >
        <div className='flex flex-column gap-2'>
          <Controller
            name='shop_id'
            control={control}
            rules={{ required: '아이디를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  value={field.value}
                  placeholder='아이디'
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
          <Controller
            name='shop_pw'
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
        <div className='flex align-items-center justify-content-between mb-5'>
          <div className='flex align-items-center mr-8'>
            <Controller
              name='checked'
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id='saveId'
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    checked={isRemember}
                    className='mr-2'
                  />
                  <label htmlFor='saveId'>아이디 저장</label>
                </>
              )}
            />
          </div>
          <div>
            <Link
              to='/auth/find'
              className='text-purple-500 cursor-pointer no-underline'
            >
              아이디/비밀번호 찾기
            </Link>
          </div>
        </div>
        <Toast ref={toast} />
        <Button
          label='로그인'
          type='submit'
        />
      </form>

      <Button
        type='button'
        severity='help'
        outlined
      >
        <Link
          to='/auth/sign-up'
          className='text-purple-500 font-semibold cursor-pointer no-underline w-full'
        >
          회원가입
        </Link>
      </Button>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1600 800'
        class='fixed left-0 top-0 min-h-screen min-w-screen'
        preserveAspectRatio='none'
        style={{ zIndex: '-1' }}
      >
        <rect
          fill='var(--primary-500)'
          width='1600'
          height='800'
        ></rect>
        <path
          fill='var(--primary-400)'
          d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'
        ></path>
        <path
          fill='var(--primary-300)'
          d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'
        ></path>
        <path
          fill='var(--primary-200)'
          d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'
        ></path>
        <path
          fill='var(--primary-100)'
          d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'
        ></path>
      </svg>
    </main>
  );
}

export default SignIn;
