import { useState } from 'react';

// import Logo from 'components/common/Logo';

import { Form, Link, redirect } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import KakaoLogin from '../../components/common/KakaoLogin';
import Logo from 'components/common/Logo';
import axios from 'axios';

function SignIn() {
  const [checked, setChecked] = useState(false);

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo />

      <Form
        method='post'
        className='flex flex-column flex-wrap gap-4'
      >
        <div className='flex flex-column gap-2'>
          <label htmlFor='staff_id'>아이디</label>
          <InputText
            id='staff_id'
            name='staff_id'
          />
        </div>
        <div className='flex flex-column gap-2'>
          <label htmlFor='staff_pw'>비밀번호</label>
          <Password
            id='staff_pw'
            name='staff_pw'
            feedback={false}
            toggleMask
          />
        </div>
        <div className='flex align-items-center justify-content-between mb-4'>
          <div className='flex align-items-center mr-8'>
            <Checkbox
              id='rememberme'
              onChange={(e) => setChecked(e.checked)}
              checked={checked}
              className='mr-2'
            />
            <label htmlFor='rememberme'>아이디 저장</label>
          </div>
          <Link
            to='/auth/find'
            className='font-medium no-underline text-blue-500 text-right cursor-pointer'
          >
            아이디/비밀번호 찾기
          </Link>
        </div>
        <Button
          label='로그인'
          type='submit'
        />
        <KakaoLogin />
        <Link
          to='/auth/sign-up'
          className='font-medium no-underline text-black-500 text-left cursor-pointer'
        >
          미용실 등록(점주 회원가입)
        </Link>
      </Form>
    </main>
  );
}

export default SignIn;

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
      url: 'http://localhost:8080/auth/sign-in',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(authData),
    });

    console.log('response>>>>>>', response);
    resData = response.data;

    const token = resData.jwtauthtoken;
    localStorage.setItem('jwtauthtoken', token);
    localStorage.setItem('email', authData.email);
  } catch (error) {
    console.log('error:', error);
    throw new Error('error 발생되었습니다');
  }

  return redirect('/');
}
