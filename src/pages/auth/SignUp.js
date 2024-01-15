import { useState, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Logo from 'components/common/Logo';

import { Steps } from 'primereact/steps';
import { Form, Link } from 'react-router-dom';
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
  const [selectClosedDay, setSelectClosedDay] = useState(null);
  const [message, setMessage] = useState('');
  const [shopCode, setShopCode] = useState('');

  const stepItems = [
    { label: '사업자등록번호 인증' },
    { label: '미용실 정보' },
    // { label: '회원가입 정보' },
  ];

  const closedDay = [
    { name: '일요일', code: 1 },
    { name: '월요일', code: 2 },
    { name: '화요일', code: 3 },
    { name: '수요일', code: 4 },
    { name: '목요일', code: 5 },
    { name: '금요일', code: 6 },
    { name: '토요일', code: 7 },
  ];

  // 상업자 등록번호 인증
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
        const uniqueCode = uuidv4();
        setShopCode(uniqueCode);
      } else {
        setMessage(response.data.data[0].tax_type);
      }
    } catch (error) {
      console.error('에러:', error);
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

      <Form
        method='post'
        className='flex flex-row flex-wrap gap-6 col-md-12'
      >
        {activeIndex === 0 ? (
          <>
            <div className='flex flex-column gap-4 min-w-full'>
              <div className='p-inputgroup flex-1'>
                <InputMask
                  name='shop_register'
                  value={registerCode}
                  onChange={(e) => setRegisterCode(e.value)}
                  mask='999-99-99999'
                  placeholder='사업자등록번호'
                />
                <Button
                  label='인증하기'
                  type='button'
                  onClick={handleAuth}
                />
              </div>
              {message}
              <InputText
                name='shop_code'
                placeholder='미용실 고유코드'
                value={shopCode}
                disabled
              />
              <div className='p-inputgroup'>
                <InputText
                  name='shop_id'
                  placeholder='아이디'
                />
                <Button
                  label='중복확인'
                  type='button'
                />
              </div>

              <Password
                name='shop_pw'
                placeholder='비밀번호'
                feedback={false}
                toggleMask
              />

              <Password
                name='shop_pw_check'
                placeholder='비밀번호 확인'
                feedback={false}
                toggleMask
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
          </>
        ) : (
          <>
            <div className='flex flex-column gap-4 min-w-full'>
              <div className='col-md-6 flex flex-column gap-4'>
                <InputText
                  name='shop_name'
                  placeholder='상호명'
                />
                <InputText
                  name='shop_address'
                  placeholder='주소'
                />
                <InputText
                  name='shop_phone'
                  placeholder='전화번호'
                />
                <Calendar
                  name='shop_start'
                  placeholder='영업 시작 시간'
                  timeOnly
                />
                <Calendar
                  name='shop_end'
                  placeholder='영업 종료 시간'
                  timeOnly
                />
                <MultiSelect
                  name='shop_off'
                  value={selectClosedDay}
                  onChange={(e) => setSelectClosedDay(e.value)}
                  options={closedDay}
                  optionLabel='name'
                  placeholder='정기 휴무일'
                  className='w-full'
                />
                <InputText
                  name='shop_tag'
                  placeholder='해시태그'
                />
                <InputTextarea
                  name='shop_intro'
                  placeholder='미용실 소개글'
                  rows={5}
                  autoResize
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
      </Form>
    </main>
  );
}

export default SignUp;

export async function action({ request }) {
  const data = await request.formData();
  console.log(data);
  const authData = {
    shop_register: data.get('shop_register'),
    shop_code: data.get('shop_code'),
    shop_id: data.get('shop_id'),
    shop_pw: data.get('shop_pw'),
    shop_name: data.get('shop_name'),
    shop_address: data.get('shop_address'),
    shop_phone: data.get('shop_phone'),
    // shop_start: data.get('shop_start'),
    // shop_end: data.get('shop_end'),
    shop_off: data.get('shop_off'),
    shop_tag: data.get('shop_tag'),
    shop_intro: data.get('shop_intro'),
  };
  console.log('authData>>', authData);
  let resData = '';
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:8080/auth/sign-up',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(authData),
    });

    console.log('response>>>>>>', response);
    resData = response.data;
    console.log(resData);
    const token = resData.jwtauthtoken;
    localStorage.setItem('jwtauthtoken', token);
    localStorage.setItem('staff_id', authData.staff_id);
  } catch (error) {
    console.log('error:', error);
    throw new Error('error 발생되었습니다');
  }

  return redirect('/');
}
