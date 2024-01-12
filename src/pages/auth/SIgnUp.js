import React, { useState, useRef } from 'react';

import Logo from 'components/common/Logo';
import { Form, Link, redirect } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

function SignUp() {
  const toast = useRef(null);
  const stepItems = [
    {
      label: '미용실 인증',
      command: (event) => {
        toast.current.show({
          severity: 'info',
          summary: 'First Step',
          detail: event.item.label,
        });
      },
    },
    {
      label: '회원가입',
      command: (event) => {
        toast.current.show({
          severity: 'info',
          summary: 'Second Step',
          detail: event.item.label,
        });
      },
    },
  ];

  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo
        size='text-4xl'
        margin='mb-6'
      />

      <div className='card my-4'>
        <Toast ref={toast}></Toast>
        <Steps
          model={stepItems}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
      </div>

      <Form
        // method='post'
        action='/'
        className='flex flex-column flex-wrap gap-4 mb-4'
      >
        {activeIndex === 0 ? (
          <>
            <div className='p-inputgroup flex-1'>
              <InputText
                placeholder='미용실 고유코드'
                name='shop_code'
              />
              <Button
                label='인증하기'
                type='button'
              />
            </div>

            <InputText
              name='shop_name'
              placeholder='상호명'
              disabled
            />

            {/* 미용실 고유코드, 상호명 체크 후 선택 가능 */}
            <Button
              outlined={activeIndex !== 1}
              label='다음 단계'
              onClick={() => setActiveIndex(1)}
              type='button'
            />
          </>
        ) : (
          <>
            <div className='p-inputgroup flex-1'>
              <InputText
                name='staff_id'
                placeholder='아이디'
              />
              <Button
                label='중복확인'
                type='button'
              />
            </div>

            <Password
              name='staff_pw'
              placeholder='비밀번호'
              feedback={false}
              toggleMask
            />

            <Password
              name='staff_pw_check'
              placeholder='비밀번호 확인'
              feedback={false}
              toggleMask
            />

            <InputText
              name='staff_name'
              placeholder='이름'
            />

            <InputText
              name='staff_nickname'
              placeholder='닉네임'
            />

            <InputNumber
              name='staff_phone'
              placeholder='전화번호'
            />

            <InputTextarea
              name='staff_intro'
              placeholder='소개글'
              autoResize
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              cols={30}
            />

            <FileUpload
              name='demo[]'
              url={'/api/upload'}
              multiple
              accept='image/*'
              maxFileSize={1000000}
              emptyTemplate={
                <p className='m-0'>Drag and drop files to here to upload.</p>
              }
            />

            <Button
              outlined={activeIndex !== 0}
              label='이전 단계'
              onClick={() => setActiveIndex(0)}
              type='button'
            />

            <Button
              label='회원가입'
              type='submit'
            />
          </>
        )}
      </Form>
      <Link
        to='/auth/sign-in'
        className='text-blue-500 cursor-pointer'
      >
        <span className='pi pi-arrow-left'> 로그인페이지</span>
      </Link>
    </main>
  );
}

export default SignUp;

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    staff_id: data.get('staff_id'),
    staff_pw: data.get('staff_pw'),
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
