import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import Logo from 'components/common/Logo';

import { Link, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

function SignIn() {
  const [cookies, setCookie, removeCookie] = useCookies(['rememberUserId']);
  const [userid, setUserid] = useState('');
  const [isRemember, setIsRemember] = useState(false);

  const defaultValues = {
    value: '',
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      shop_id: cookies.rememberUserId || '',
      shop_pw: '',
    },
  });

  const navigate = useNavigate();

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

    console.log('authData >> ', authData);

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/sign-in',
        authData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Server response:', response.data);
      const tokenShop_seq = response.data.shop_seq;
      const token = response.data.jwtauthtoken;
      localStorage.setItem('shop_seq', tokenShop_seq);
      localStorage.setItem('jwtauthtoken', token);

      if (isRemember) {
        setCookie('rememberUserId', data.shop_id, {
          maxAge: 5 * (60 * 60 * 24),
        });
      } else {
        removeCookie('rememberUserId');
      }

      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  // const onSubmit = async (data) => {
  //   const authData = {
  //     shop_id: data.shop_id,
  //     shop_pw: data.shop_pw,
  //   };

  //   console.log('authData >> ', authData);

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8080/auth/sign-in',
  //       authData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     console.log('Server response:', response.data);
  //     const token = response.data.jwtauthtoken;
  //     localStorage.setItem('jwtauthtoken', token);
  //     // localStorage.setItem('shop_seq', authData.shop_seq);

  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error during signup:', error);
  //   }
  // };

  // Cookie 아이디 저장
  useEffect(() => {
    if (cookies.rememberUserId !== undefined) {
      setUserid(cookies.rememberUserId);
      setIsRemember(true);
    }
  }, []);

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
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
                  value={field.value || ''}
                  placeholder='아이디'
                  className={classNames({
                    'p-invalid': fieldState.error,
                  })}
                  onChange={(e) => {
                    field.onChange(e);
                    setUserid(e.target.value); // 아이디 값 업데이트
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
        <div className='flex align-items-center justify-content-between mb-4'>
          <div className='flex align-items-center mr-8'>
            {/* <Checkbox
              id='saveId'
              onChange={(e) => handleOnChange(e)}
              checked={isRemember}
              className='mr-2'
            />
            <label htmlFor='saveId'>아이디 저장</label> */}

            <Controller
              name='checked'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Checkbox
                    id='saveId'
                    inputId={field.name}
                    checked={field.value}
                    inputRef={field.ref}
                    onChange={(e) => field.onChange(e.checked)}
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
    </main>
  );
}

export default SignIn;
