import { useState, useRef } from 'react';
import { nonAuthAxios } from '../../api/AxiosAPI';
import Logo from 'components/common/Logo';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Steps } from 'primereact/steps';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function SignUp() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [registerCode, setRegisterCode] = useState('');
  const [message, setMessage] = useState('');
  const toast = useRef(null);
  // 아이디 중복 체크
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  // 패스워드 확인 일치
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const navigate = useNavigate();
  const stepItems = [
    { label: '사업자등록번호 인증' },
    { label: '미용실 정보' },
  ];

  const closedDay = [
    { name: '휴무일 없음', code: 0 },
    { name: '일요일', code: 1 },
    { name: '월요일', code: 2 },
    { name: '화요일', code: 3 },
    { name: '수요일', code: 4 },
    { name: '목요일', code: 5 },
    { name: '금요일', code: 6 },
    { name: '토요일', code: 7 },
  ];

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
    const shopOffString = data.shop_regular
      .map((option) => option.code)
      .join(',');

    const requestData = {
      ...data,
      shop_start: data.shop_start.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      shop_end: data.shop_end.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      shop_regular: shopOffString,
    };

    console.log('NonAuth Request:', requestData);

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

  // 사업자 등록번호 인증 핸들러
  async function handleAuth() {
    try {
      const serviceKey =
        'Tc3kxw1IJXKsD2iZOLqJ76tSdzHILwnTQoMdB%2Bj5040SHBDDspm3lwJZVv2Ll8R60OuoK8oT%2F6zh6r63iQ96UQ%3D%3D';

      const cleanedValue = registerCode.replace(/-/g, '');
      const data = {
        b_no: [cleanedValue],
      };

      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('결과:', response.data.data[0]);

      let b_stt_cd = response.data.data[0].b_stt_cd;

      if (b_stt_cd == '01') {
        setMessage('인증되었습니다. ');
        // const uniqueCode = uuidv4();
        // setShopCode(uniqueCode);
      } else {
        setMessage(response.data.data[0].tax_type);
      }
    } catch (error) {
      console.error('에러:', error);
    }
  }

  // 아이디 중복 체크 핸들러
  async function handleIdCheck() {
    const shopIdValue = getValues('shop_id');

    if (!shopIdValue || shopIdValue.trim() === '') {
      setIdCheckMessage('아이디를 입력해주세요.');
      return;
    }

    const validIdRegex = /^[a-zA-Z0-9]+$/;
    if (!validIdRegex.test(shopIdValue)) {
      setIdCheckMessage('아이디는 영어와 숫자만 입력 가능합니다.');
      return;
    }

    const shopId = {
      shop_id: getValues('shop_id'),
    };

    nonAuthAxios()
      .post(`/auth/duplicate-check`, shopId)
      .then((response) => {
        // console.log('Auth Response:', response.data);
        const isIdAvailable = response.data;
        if (isIdAvailable) {
          setIdCheckMessage('사용 가능한 아이디입니다.');
          setValue('shop_id', shopId.shop_id);
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
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg gap-4 w-8'>
      <Logo size='text-4xl' />

      <div className='card my-4'>
        <Steps
          model={stepItems}
          activeIndex={activeIndex}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-column'
      >
        <div className='flex'>
          {/* Step1. 회원가입 */}
          <div className='col-6 flex flex-column gap-4'>
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_register'
                control={control}
                rules={{ required: '사업자등록번호는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <div className='p-inputgroup flex-1'>
                      <InputMask
                        value={field.value || ''}
                        placeholder='사업자등록번호'
                        mask='999-99-99999'
                        // onChange={(e) => setRegisterCode(e.value)}
                        onChange={field.onChange}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <Button
                        label='인증하기'
                        type='button'
                        onClick={handleAuth}
                      />
                    </div>
                    {message}
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_id'
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
                name='shop_pw'
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
                name='shop_pw_check'
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
          </div>
          {/* Step2. 미용실 정보 입력 */}
          <div className='col-6 flex flex-column gap-4'>
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_name'
                control={control}
                rules={{ required: '미용실 이름을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='상호명'
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
                name='shop_address'
                control={control}
                rules={{ required: '미용실 주소를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='주소'
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
                name='shop_phone'
                control={control}
                rules={{ required: '미용실 연락처를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      placeholder='연락처'
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
                name='shop_start'
                control={control}
                rules={{ required: '영업 시작 시간을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      id={field.name}
                      value={field.value || ''}
                      placeholder='영업 시작 시간'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                      timeOnly
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_end'
                control={control}
                rules={{ required: '영업 종료 시간을 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      id={field.name}
                      value={field.value || ''}
                      placeholder='영업 종료 시간'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                      timeOnly
                    />
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <Controller
              name='shop_regular'
              control={control}
              rules={{ required: '휴무일을 입력해주세요' }}
              render={({ field }) => (
                <>
                  <MultiSelect
                    name='shop_regular'
                    // value={selectClosedDay}
                    onChange={field.onChange}
                    value={field.value || ''}
                    options={closedDay}
                    optionLabel='name'
                    placeholder='정기 휴무일'
                  />
                </>
              )}
            />

            <Controller
              name='shop_tag'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ''}
                    placeholder='해시태그'
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    onChange={field.onChange}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />

            <Controller
              name='shop_intro'
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id={field.name}
                  value={field.value || ''}
                  placeholder='미용실 소개글'
                  onChange={field.onChange}
                  rows={5}
                  autoResize
                />
              )}
            />
          </div>
        </div>
        <div className='mt-6 flex align-center justify-content-between'>
          <Button
            type='button'
            severity='help'
            className='w-3'
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
            className='w-3'
          />
        </div>
      </form>
    </main>
  );
}

export default SignUp;
