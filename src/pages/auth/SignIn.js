import { useEffect } from 'react';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Logo from 'components/common/Logo';

import { Form, Link, redirect } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

function SignIn() {
  const [cookies, setCookie, removeCookie] = useCookies(['rememberUserId']);
  const [userid, setUserid] = useState('');
  const [isRemember, setIsRemember] = useState(false);

  // Cookie 아이디 저장
  useEffect(() => {
    if (cookies.rememberUserId !== undefined) {
      setUserid(cookies.rememberUserId);
      setIsRemember(true);
    }
  }, []);

  const handleOnChange = (e) => {
    setIsRemember(e.target.checked);
    if (!e.target.checked) {
      removeCookie('rememberUserId');
    } else {
      setCookie('rememberUserId', userid, { maxAge: 5 * (60 * 60 * 24) });
    }
  };

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo
        size='text-4xl'
        margin='mb-6'
      />

      <Form
        method='post'
        className='flex flex-column flex-wrap gap-4'
      >
        <div className='flex flex-column gap-2'>
          <InputText
            id='staff_id'
            name='staff_id'
            defaultValue={userid}
            placeholder='아이디'
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <div className='flex flex-column gap-2'>
          <Password
            id='staff_pw'
            name='staff_pw'
            placeholder='비밀번호'
            feedback={false}
            toggleMask
          />
        </div>
        <div className='flex align-items-center justify-content-between mb-4'>
          <div className='flex align-items-center mr-8'>
            <Checkbox
              id='saveId'
              onChange={(e) => handleOnChange(e)}
              checked={isRemember}
              className='mr-2'
            />
            <label htmlFor='saveId'>아이디 저장</label>
          </div>
        </div>
        <Button
          label='로그인'
          type='submit'
        />

        <Link
          to='/auth/sign-up'
          className='text-blue-500 cursor-pointer'
        >
          일반 회원가입
        </Link>
        <Link
          to='/auth/register'
          className='text-blue-500 cursor-pointer'
        >
          점주 회원가입(미용실 등록)
        </Link>
        <Link
          to='/auth/find'
          className='text-blue-500 cursor-pointer'
        >
          아이디/비밀번호 찾기
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
