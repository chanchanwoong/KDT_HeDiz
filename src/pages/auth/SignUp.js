import { useState, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';

import Logo from 'components/common/Logo';

import { Steps } from 'primereact/steps';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

function SignUp() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [registerCode, setRegisterCode] = useState('');
  const [message, setMessage] = useState('');

  const stepItems = [
    { label: '사업자등록번호 인증' },
    { label: '미용실 정보' },
    // { label: '회원가입 정보' },
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
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    console.log('Form data submitted:', data);
    const shopOffString = data.shop_regular
      .map((option) => option.code)
      .join(', ');

    const authData = {
      shop_register: registerCode,
      shop_id: data.shop_id,
      shop_pw: data.shop_pw,
      shop_name: data.shop_name,
      shop_address: data.shop_address,
      shop_phone: data.shop_phone,
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
      shop_tag: data.shop_tag,
      shop_intro: data.shop_intro,
      shop_image: 'test',
    };

    console.log('authData >> ', authData);

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/sign-up',
        authData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  // 사업자 등록번호 인증
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

  // 아이디 중복 체크
  async function handleIdCheck() {
    const shopId = {
      shop_id: data.shop_id,
    };
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/sign-up',
        shopId,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  }

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg gap-4 w-4'>
      <Logo size='text-4xl' />

      <div className='card my-4'>
        <Steps
          model={stepItems}
          activeIndex={activeIndex}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method='post'
        className='flex flex-row flex-wrap gap-6 col-md-12'
      >
        {activeIndex === 0 ? (
          <div className='flex flex-column gap-4 min-w-full'>
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
                      onChange={(e) => setRegisterCode(e.value)}
                      className={classNames({ 'p-invalid': fieldState.error })}
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
            <Controller
              name='shop_id'
              control={control}
              rules={{ required: '아이디는 필수입력 항목입니다.' }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ''}
                    placeholder='아이디'
                    className={classNames({ 'p-invalid': fieldState.error })}
                    onChange={field.onChange}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
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
                    onChange={field.onChange}
                    feedback={false}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
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
                    onChange={field.onChange}
                    feedback={false}
                    toggleMask
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            <div className='flex justify-content-between mt-4'>
              <div>
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
              </div>
              <Button
                label='다음 단계'
                onClick={() => setActiveIndex(1)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className='flex flex-column gap-4 min-w-full'>
              <div className='col-md-6 flex flex-column gap-4'>
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

                <Controller
                  name='shop_regular'
                  control={control}
                  render={({ field }) => (
                    <>
                      <MultiSelect
                        name='shop_regular'
                        // value={selectClosedDay}
                        value={field.value || ''}
                        onChange={field.onChange}
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
              <div className='flex justify-content-between mt-4'>
                <Button
                  label='이전 단계'
                  onClick={() => setActiveIndex(0)}
                />
                <Button
                  label='회원가입'
                  type='submit'
                />
              </div>
            </div>
          </>
        )}
      </form>
    </main>
  );
}

export default SignUp;
