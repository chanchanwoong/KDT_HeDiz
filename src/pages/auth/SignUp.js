import { useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { nonAuthAxios } from 'api/AxiosAPI';
import Logo from 'components/common/Logo';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';

function SignUp() {
  const navigate = useNavigate();
  const toast = useRef(null);
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

  // 사업자 등록 번호
  const [message, setMessage] = useState('');
  const [isRegistrationVerified, setIsRegistrationVerified] = useState(false); // 사업자 등록번호 인증 여부

  // 사업자 등록번호 인증 핸들러
  async function handleAuth() {
    const shopIdValue = getValues('shop_register');
    try {
      const serviceKey =
        'Tc3kxw1IJXKsD2iZOLqJ76tSdzHILwnTQoMdB%2Bj5040SHBDDspm3lwJZVv2Ll8R60OuoK8oT%2F6zh6r63iQ96UQ%3D%3D';

      const cleanedValue = shopIdValue.replace(/-/g, '');
      console.log(cleanedValue);
      const data = {
        b_no: [cleanedValue],
      };

      nonAuthAxios()
        .post(
          `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`,
          data
        )
        .then((response) => {
          console.log('결과:', response.data.data[0]);

          let b_stt_cd = response.data.data[0].b_stt_cd;

          if (b_stt_cd == '01') {
            setMessage('인증되었습니다. ');
            setIsRegistrationVerified(true);
          } else {
            setMessage(response.data.data[0].tax_type);
            setIsRegistrationVerified(false);
          }
        })
        .catch((error) => {
          console.error('Non-Auth Error:', error);
          setIsRegistrationVerified(false);
        });
    } catch (error) {
      console.error('에러:', error);
      setIsRegistrationVerified(false);
    }
  }

  // 아이디
  const [idCheckMessage, setIdCheckMessage] = useState(''); // 중복 메시지
  const [isIdAvailable, setIsIdAvailable] = useState(true); // 아이디 사용 가능 여부
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 여부

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

    try {
      const response = await nonAuthAxios().post(
        `/auth/duplicate-check`,
        shopId
      );
      const isIdAvailable = response.data;

      if (isIdAvailable) {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdAvailable(true);
        setIsIdChecked(true);
        setValue('shop_id', shopId.shop_id);
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
        setIsIdChecked(true);
      }
    } catch (error) {
      console.error('Auth Error:', error);
    }
  }

  // 비밀번호
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호 일치 여부
  const [isPasswordMatched, setIsPasswordMatched] = useState(false); // 비밀번호 일치 여부

  // 비밀번호 및 비밀번호 확인 입력
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
        setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordMatchMessage('비밀번호가 일치합니다');
      }
    }
  };

  // 주소
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  // 휴무일
  const [checked, setChecked] = useState(false);

  const handleAddressSelect = (data) => {
    const { address } = data;
    setSelectedAddress(address);
    setValue('shop_address', address);
    setAddressModalOpen(false);
  };

  const closedDay = [
    { name: '일요일', code: 1 },
    { name: '월요일', code: 2 },
    { name: '화요일', code: 3 },
    { name: '수요일', code: 4 },
    { name: '목요일', code: 5 },
    { name: '금요일', code: 6 },
    { name: '토요일', code: 7 },
  ];

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

  // form 유효성 에러 메세지
  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  // 회원가입
  const onSubmit = async (data) => {
    // 휴무일 포맷팅
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

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg gap-4 w-8'>
      <h1 className='flex align-items-center justify-content-between m-0 mb-4'>
        회원가입
        <Logo size='text-4xl' />
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-column sinup'
      >
        <div className='flex'>
          <div className='col-6 flex flex-column gap-4'>
            {/* 사업자등록번호 */}
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
                        placeholder='사업자등록번호(*)'
                        mask='999-99-99999'
                        onChange={field.onChange}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <Button
                        label='인증하기'
                        type='button'
                        className='w-3'
                        onClick={handleAuth}
                      />
                    </div>
                    <small>
                      {message}
                      {getFormErrorMessage(field.name)}
                    </small>
                  </>
                )}
              />
            </div>
            {/* 아이디 */}
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
                        placeholder='아이디(*)'
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
                        className='w-3'
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
            {/* 비밀번호 */}
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_pw'
                control={control}
                rules={{ required: '비밀번호는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      value={field.value || ''}
                      placeholder='비밀번호(*)'
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
            {/* 비밀번호 확인 */}
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_pw_check'
                control={control}
                rules={{ required: '비밀번호는 필수입력 항목입니다.' }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      value={field.value || ''}
                      placeholder='비밀번호 확인(*)'
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
            {/* 상호명 */}
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
                      placeholder='상호명(*)'
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
            <div className='flex justify-content-between gap-4'>
              {/* 영업 시작 시간 */}
              <div className='flex flex-column gap-2 flex-grow-1'>
                <Controller
                  name='shop_start'
                  control={control}
                  rules={{ required: '영업 시작 시간을 입력해주세요' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Calendar
                        id={field.name}
                        value={field.value || ''}
                        placeholder='영업 시작 시간(*)'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                        onChange={field.onChange}
                        timeOnly
                        step={30}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* 영업 종료 시간 */}
              <div className='flex flex-column gap-2 flex-grow-1'>
                <Controller
                  name='shop_end'
                  control={control}
                  rules={{ required: '영업 종료 시간을 입력해주세요' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Calendar
                        id={field.name}
                        value={field.value || ''}
                        placeholder='영업 종료 시간(*)'
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
            </div>

            {/* 휴무일 */}
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_regular'
                control={control}
                rules={{ required: '휴무일을 입력해주세요' }}
                render={({ field }) => (
                  <>
                    <MultiSelect
                      name='shop_regular'
                      onChange={(e) => {
                        const value = e.value;
                        const updatedValue = value.includes(0)
                          ? [0]
                          : value.filter((day) => day !== 0);
                        field.onChange(updatedValue);
                      }}
                      value={field.value || []}
                      options={closedDay}
                      optionLabel='name'
                      placeholder='정기 휴무일(*)'
                      disabled={checked}
                    />
                    <div className='flex align-items-center mt-2'>
                      <Checkbox
                        onChange={(e) => {
                          setChecked(e.checked);
                          if (e.checked) {
                            field.onChange([{ name: '휴무일 없음', code: 0 }]);
                          } else {
                            field.onChange([]);
                          }
                        }}
                        checked={checked}
                      />
                      <label
                        htmlFor='ingredient1'
                        className='ml-2'
                      >
                        휴무일 없음
                      </label>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className='col-6 flex flex-column gap-4'>
            {/* 주소 */}
            <div className='flex flex-column gap-2'>
              <Controller
                name='shop_address'
                control={control}
                rules={{ required: '미용실 주소를 입력해주세요' }}
                render={({ field, fieldState }) => (
                  <>
                    <div className='p-inputgroup flex-1'>
                      <InputText
                        id={field.name}
                        value={field.value || ''}
                        placeholder='주소(*)'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                        onChange={field.onChange}
                      />
                      <Button
                        type='button'
                        label='주소 검색'
                        className='w-3'
                        onClick={() => setAddressModalOpen(true)}
                      />
                    </div>
                    {isAddressModalOpen && (
                      <DaumPostcode
                        onComplete={handleAddressSelect}
                        autoClose={false}
                        animation
                      />
                    )}
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            {/* 연락처 */}
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
                      placeholder='연락처(*)'
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
            {/* 해시태그 */}
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
            {/* 미용실 소개글 */}
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
            disabled={
              !isIdAvailable ||
              !isIdChecked ||
              !isRegistrationVerified ||
              !isPasswordMatched
            }
          />
        </div>
      </form>
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
          fill='var(--primary-400)'
          d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'
        ></path>
        <path
          fill='var(--primary-100)'
          d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'
        ></path>
      </svg>
    </main>
  );
}

export default SignUp;
