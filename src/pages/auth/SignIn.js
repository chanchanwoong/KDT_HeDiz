import { useState } from 'react';
// import { Form, useNavigate, json, redirect, Link } from 'react-router-dom';
// import Logo from 'components/common/Logo';

import { Form, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import KakaoLogin from '../../components/common/KakaoLogin';

function SignIn() {
  const [checked, setChecked] = useState(false);

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      {/* 로고 컴포넌트 분리 필요 */}
      <span className='flex align-items-center justify-content-center gap-1 mb-4'>
        <span className='font-medium text-4xl font-bold'>
          He<span className='text-primary'>Diz</span>
        </span>
      </span>

      <Form
        // method='post'
        action='/'
        className='flex flex-column flex-wrap gap-4'
      >
        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>아이디</label>
          <InputText id='userid' />
        </div>
        <div className='flex flex-column gap-2'>
          <label htmlFor='passwd'>비밀번호</label>
          <Password
            id='passwd'
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
          아직 회원이 아니신가요?
        </Link>
      </Form>
    </main>
  );
}

export default SignIn;
