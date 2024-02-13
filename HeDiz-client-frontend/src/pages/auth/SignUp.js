import { useState, useRef } from 'react';
import { nonAuthAxios } from 'api/AxiosAPI';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { InputMask } from 'primereact/inputmask';

function SignUp() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const defaultValues = {
    value: '',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm({ defaultValues });

  // 아이디
  const [idCheckMessage, setIdCheckMessage] = useState(''); // 중복 메시지
  const [isIdAvailable, setIsIdAvailable] = useState(true); // 아이디 사용 가능 여부
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 여부

  // 비밀번호
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호 일치 여부
  const [isPasswordMatched, setIsPasswordMatched] = useState(false); // 비밀번호 일치 여부

  // 아이디 검증
  async function handleIdCheck() {
    const custId = {
      cust_id: getValues('cust_id'),
    };

    if (!custId.cust_id || custId.cust_id.trim() === '') {
      setIdCheckMessage('아이디를 입력해주세요.');
      return;
    }

    const validIdRegex = /^[a-zA-Z0-9]+$/;
    if (!validIdRegex.test(custId.cust_id)) {
      setIdCheckMessage('아이디는 영어와 숫자만 입력 가능합니다.');
      return;
    }

    nonAuthAxios()
      .post(`/auth/duplicate-check`, custId)
      .then((response) => {
        const isIdAvailable = response.data;
        if (isIdAvailable) {
          setIdCheckMessage('사용 가능한 아이디입니다.');
          setIsIdAvailable(true);
          setIsIdChecked(true);
          setValue('cust_id', custId.cust_id);
        } else {
          setIdCheckMessage('이미 사용 중인 아이디입니다.');
          setIsIdAvailable(false);
          setIsIdChecked(false);
        }
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }

  // 비밀번호 및 비밀번호 확인 입력 검증
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordMatch(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    checkPasswordMatch(password, e.target.value);
  };

  // 비밀번호 일치 여부 확인
  const checkPasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword) {
      const matched = password === confirmPassword;
      setPasswordsMatch(matched);
      setIsPasswordMatched(matched);
      if (!matched) {
        setPasswordMatchMessage('비밀번호가 일치하지 않습니다');
      } else {
        setPasswordMatchMessage('비밀번호가 일치합니다');
      }
    }
  };

  const onSubmit = async (data) => {
    // 중복 확인을 하지 않은 경우
    if (!isIdChecked) {
      setIdCheckMessage('아이디 중복을 확인해주세요');
      return;
    } else {
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
      console.log(requestData);

      nonAuthAxios()
        .post('/auth/sign-up', requestData)
        .then((response) => {
          console.log('Non-Auth Response:', response.data);
          navigate('/auth/sign-in');
        })
        .catch((error) => {
          console.error('Non-Auth Error:', error);
          showError();
        });
    }
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

  return (
    <>
      <h2 className='mt-0 mb-6'>회원가입</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-column'
      >
        <div className=' flex flex-column gap-4'>
          <div className='flex flex-column gap-2'>
            <span className='text-color-secondary pl-1 font-semibold'>
              아이디
            </span>
            <Controller
              name='cust_id'
              control={control}
              rules={{ required: '아이디는 필수입력 항목입니다' }}
              render={({ field, fieldState }) => (
                <>
                  <div className='p-inputgroup flex-1'>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='아이디를 입력해주세요'
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
                      className='text-sm'
                    />
                  </div>
                  {idCheckMessage && (
                    <small className={isIdAvailable ? 'p-success' : 'p-error'}>
                      {idCheckMessage}
                    </small>
                  )}
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
              rules={{ required: '비밀번호는 필수입력 항목입니다' }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    value={field.value || ''}
                    placeholder='비밀번호를 입력해주세요'
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
            <span className='text-color-secondary pl-1 font-semibold'>
              비밀번호 확인
            </span>
            <Controller
              name='cust_pw_check'
              control={control}
              rules={{ required: '비밀번호는 필수입력 항목입니다.' }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    value={field.value || ''}
                    placeholder='비밀번호 확인을 위해 입력해주세요'
                    className={classNames({ 'p-invalid': fieldState.error })}
                    onChange={(e) => {
                      field.onChange(e);
                      handleConfirmPasswordChange(e);
                    }}
                    feedback={false}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                  {passwordMatchMessage && (
                    <small
                      className={`password-match-message ${
                        passwordsMatch ? 'p-success' : 'p-error'
                      }`}
                    >
                      {passwordMatchMessage}
                    </small>
                  )}
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
          <div className='flex flex-column gap-2'>
            <span className='text-color-secondary pl-1 font-semibold'>
              전화번호
            </span>
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

          <div className='flex flex-column gap-2'>
            <span className='text-color-secondary pl-1 font-semibold'>
              성별
            </span>
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

        <Button
          label='회원가입'
          type='submit w-full'
          className='btn__submit'
        />
      </form>
    </>
  );
}

export default SignUp;
