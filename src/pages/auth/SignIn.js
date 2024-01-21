import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Controller, useForm } from 'react-hook-form';
import { nonAuthAxios } from '../../api/AxiosAPI';
import Logo from '../../components/common/Logo';

import { Link, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';

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
      cust_id: cookies.rememberUserId || '',
      cust_pw: '',
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
      cust_id: data.cust_id,
      cust_pw: data.cust_pw,
    };

    console.log('Non-Auth Request: ', authData);

    // [POST] 로그인
    nonAuthAxios()
      .post('/auth/sign-in', authData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);
        const resData = response.data;
        const jwtToken = resData.jwtauthtoken;
        const custSeq = resData.cust_seq;
        const custName = resData.cust_name;

        localStorage.setItem('jwtauthtoken', jwtToken);
        localStorage.setItem('cust_seq', custSeq);
        localStorage.setItem('cust_name', custName);

        if (isRemember) {
          setCookie('rememberUserId', data.cust_id, {
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
          cust_id: '',
          cust_pw: '',
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
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : '';
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
    <main className="flex flex-column bg-white p-6 w-auto border-round-lg">
      <Logo
        size="text-4xl"
        margin="mb-6"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="flex flex-column flex-wrap gap-4 mb-4"
      >
        <div className="flex flex-column gap-2">
          <Controller
            name="cust_id"
            control={control}
            rules={{ required: '아이디를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  value={field.value}
                  placeholder="아이디"
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
        <div className="flex flex-column gap-2">
          <Controller
            name="cust_pw"
            control={control}
            rules={{ required: '비밀번호를 입력해주세요' }}
            render={({ field, fieldState }) => (
              <>
                <Password
                  id={field.name}
                  value={field.value || ''}
                  placeholder="비밀번호"
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
        <div className="flex align-items-center justify-content-between mb-4">
          <div className="flex align-items-center mr-8">
            <Controller
              name="checked"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="saveId"
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    checked={isRemember}
                    className="mr-2"
                  />
                  <label htmlFor="saveId">아이디 저장</label>
                </>
              )}
            />
          </div>
          <div>
            <Link
              to="/auth/find"
              className="text-purple-500 cursor-pointer no-underline"
            >
              아이디/비밀번호 찾기
            </Link>
          </div>
        </div>
        <Toast ref={toast} />
        <Button
          label="로그인"
          type="submit"
        />
      </form>

      <Button
        type="button"
        severity="help"
        outlined
      >
        <Link
          to="/auth/sign-up"
          className="text-purple-500 font-semibold cursor-pointer no-underline w-full"
        >
          회원가입
        </Link>
      </Button>
    </main>
  );
}

export default SignIn;
