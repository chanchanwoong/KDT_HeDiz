import { useState, useRef } from 'react';
import { nonAuthAxios } from '../../api/AxiosAPI';
import Logo from '../../components/common/Logo';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { SelectButton } from 'primereact/selectbutton';
import { InputMask } from 'primereact/inputmask';

function SignUp() {
  const toast = useRef(null);
  // 아이디 중복 체크
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  // 패스워드 확인 일치
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const navigate = useNavigate();

  const defaultValues = {
    value: '',
  };

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    console.log('Form data submitted:', data);
    console.log('NonAuth Request:', data);
    let genderSelect = '';
    if (data.cust_gender === '남') {
      genderSelect = 0;
    } else {
      genderSelect = 1;
    }
    const requestData = {
      ...data,
      cust_gender: genderSelect,
    };

    nonAuthAxios()
      .post('/auth/sign-up', requestData)
      .then((response) => {
        console.log('Non-Auth Response:', response.data);

        showSuccess();
      })
      .catch((error) => {
        console.error('Non-Auth Error:', error);
        showError();
      });
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: '회원가입 성공 :)',
      detail: '로그인 페이지로 이동합니다.',
      life: 1000,
    });

    setTimeout(() => {
      navigate('/auth/sign-in');
    }, 1000);
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: '회원가입 실패 :(',
      detail: '회원가입에 실패했습니다 ',
      life: 3000,
    });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  // 아이디 중복 체크 핸들러
  async function handleIdCheck() {
    const custIdValue = getValues('cust_id');

    if (!custIdValue || custIdValue.trim() === '') {
      setIdCheckMessage('아이디를 입력해주세요.');
      return;
    }

    const validIdRegex = /^[a-zA-Z0-9]+$/;
    if (!validIdRegex.test(custIdValue)) {
      setIdCheckMessage('아이디는 영어와 숫자만 입력 가능합니다.');
      return;
    }

    const custId = {
      cust_id: getValues('cust_id'),
    };

    nonAuthAxios()
      .post(`/auth/duplicate-check`, custId)
      .then((response) => {
        // console.log('Auth Response:', response.data);
        const isIdAvailable = response.data;
        if (isIdAvailable) {
          setIdCheckMessage('사용 가능한 아이디입니다.');
          setValue('cust_id', custId.cust_id);
        } else {
          setIdCheckMessage('이미 사용 중인 아이디입니다.');
        }
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }

  // 이벤트 핸들러: 비밀번호 입력 시
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // 비밀번호 확인과 비교하여 일치 여부를 확인
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordMatchError('');
    }
  };

  // 이벤트 핸들러: 비밀번호 확인 입력 시
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // 비밀번호와 비교하여 일치 여부를 확인
    if (password !== e.target.value) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다222.');
    } else {
      setPasswordMatchError('');
    }
  };

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg gap-4 w-4 align-items-center'>
      <Logo size='text-4xl' />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-column'
      >
        <div className='flex'>
          {/* Step1. 회원가입 */}
          <div className=' flex flex-column gap-4'>
            <div className='flex flex-column gap-2'></div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_id'
                control={control}
                rules={{ required: '아이디는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <div className='p-inputgroup flex-1'>
                      <InputText
                        id={field.name}
                        value={field.value || ''}
                        placeholder='아이디'
                        className={classNames({
                          'p-invalid': fieldState.error || !isIdAvailable,
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                          setIdCheckMessage(''); // 아이디가 변경될 때 메시지 초기화
                        }}
                      />
                      <Button
                        label='중복확인'
                        type='button'
                        onClick={handleIdCheck}
                      />
                    </div>
                    {idCheckMessage && (
                      <small
                        className={isIdAvailable ? 'p-success' : 'p-error'}
                      >
                        {idCheckMessage}
                      </small>
                    )}
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_pw'
                control={control}
                rules={{ required: '비밀번호는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      value={field.value || ''}
                      placeholder='비밀번호'
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => {
                        field.onChange(e);
                        handlePasswordChange(e);
                      }}
                      feedback={false}
                      toggleMask
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_pw_check'
                control={control}
                rules={{ required: '비밀번호는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      value={field.value || ''}
                      placeholder='비밀번호 확인'
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => {
                        field.onChange(e);
                        handleConfirmPasswordChange(e);
                      }}
                      feedback={false}
                      toggleMask
                    />
                    {getFormErrorMessage(field.name)}
                    {passwordMatchError && (
                      <small className='p-error'>{passwordMatchError}</small>
                    )}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_name'
                control={control}
                rules={{ required: '이름을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='이름'
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
            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_phone'
                control={control}
                rules={{ required: '연락처를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputMask
                      mask='999-9999-9999'
                      id={field.name}
                      value={field.value || ''}
                      placeholder='전화번호'
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

            <div className='flex flex-column gap-2'>
              <Controller
                name='cust_gender'
                control={control}
                rules={{ required: '성별을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <SelectButton
                      id={field.name}
                      value={field.value || ''}
                      placeholder='성별'
                      options={['남', '여']}
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
          </div>
        </div>

        <div className='mt-6 flex align-center justify-content-between'>
          <Button
            type='button'
            severity='help'
            className='w-5'
            outlined
          >
            <Link
              to='/auth/sign-in'
              className='text-purple-500 font-semibold cursor-pointer no-underline w-full'
            >
              로그인페이지
            </Link>
          </Button>
          <Toast ref={toast} />
          <Button
            label='회원가입'
            type='submit'
            className='w-5'
          />
        </div>
      </form>
    </main>
  );
}

export default SignUp;
