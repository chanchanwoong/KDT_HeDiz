import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { nonAuthAxios } from 'api/AxiosAPI';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../../api/firebase-messaging-sw';
import { requestPermission } from '../../api/firebase-messaging-sw';

function SignIn() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(['rememberCustId']);
  const [userid, setUserid] = useState('');
  const [isRemember, setIsRemember] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      cust_id: cookies.rememberCustId || '',
      cust_pw: '',
    },
  });

  // 쿠키에 아이디값 저장
  const handleOnChange = (e) => {
    setIsRemember(e.target.checked);
    if (!e.target.checked) {
      removeCookie('rememberCustId');
    } else {
      // 5일 저장
      setCookie('rememberCustId', userid, { maxAge: 5 * (60 * 60 * 24) });
    }
  };

  useEffect(() => {
    if (cookies.rememberCustId !== undefined) {
      setUserid(cookies.rememberCustId);
      setIsRemember(true);
    }
  }, [cookies.rememberCustId]);

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  // 로그인
  const onSubmit = async (data) => {
    const authData = {
      cust_id: data.cust_id,
      cust_pw: data.cust_pw,
    };

    console.log('Non-Auth Request: ', authData);

    // [POST] 로그인
    nonAuthAxios()
      .post('/auth/sign-in', authData)
      .then((response) => {
        requestPermission();
        console.log('Non-Auth Response:', response.data);
        const resData = response.data;
        const jwtToken = resData.jwtauthtoken;
        const custSeq = resData.cust_seq;
        const custName = resData.cust_name;

        localStorage.setItem('jwtauthtoken', jwtToken);
        localStorage.setItem('cust_seq', custSeq);
        localStorage.setItem('cust_name', custName);

        if (isRemember) {
          setCookie('rememberCustId', data.cust_id, {
            maxAge: 5 * (60 * 60 * 24),
          });
        } else {
          removeCookie('rememberCustId');
        }

        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl && returnUrl !== '' && returnUrl !== '/auth/sign-in') {
          navigate(returnUrl);
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
        showError();
        reset({
          cust_id: '',
          cust_pw: '',
        });
      });
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
    <>
      <h2 className='mt-0 mb-6 text-center'>로그인</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            비밀번호
          </span>
          <Controller
            name='cust_pw'
            control={control}
            rules={{ required: '비밀번호를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <Password
                  id={field.name}
                  value={field.value || ''}
                  placeholder='비밀번호를 입력해주세요'
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
          <div className='flex flex-column'>
            <Link
              to='/auth/sign-up'
              className='cursor-pointer no-underline text-color-secondary font-semibold'
            >
              아직 회원이 아니신가요?
            </Link>
            <Link
              to='/auth/find'
              className='cursor-pointer no-underline text-color-secondary font-semibold'
            >
              아이디/비밀번호 찾기
            </Link>
          </div>
        </div>
        <Button
          label='로그인'
          type='submit'
          className='btn__submit'
        />
      </form>
      <Toast
        ref={toast}
        position='bottom-center'
      />
    </>
  );
}

export default SignIn;
