import { useState } from 'react';
// import { Form, useNavigate, json, redirect, Link } from 'react-router-dom';
// import Logo from 'components/common/Logo';

import { Form, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

function SignUp() {
  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      {/* 로고 컴포넌트 분리 필요 */}
      <span className='flex align-items-center justify-content-center gap-1 mb-4'>
        <span className='font-medium text-4xl font-bold'>
          He<span className='text-primary'>Diz</span> - 회원가입
        </span>
      </span>

      <Form
        // method='post'
        action='/'
        className='flex flex-column flex-wrap gap-4'
      >
        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>미용실 고유코드</label>
          <div className='p-inputgroup flex-1'>
            <InputNumber placeholder='Price' />
            <span className='p-inputgroup-addon'>인증</span>
          </div>
        </div>

        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>상호명</label>
          <InputText
            id='userid'
            disabled
          />
        </div>

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

        <div className='flex flex-column gap-2'>
          <label htmlFor='passwd'>비밀번호 확인</label>
          <Password
            id='passwd'
            feedback={false}
            toggleMask
          />
        </div>

        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>성함</label>
          <InputText id='userid' />
        </div>

        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>닉네임</label>
          <InputText id='userid' />
        </div>

        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>전화번호</label>
          <InputText id='userid' />
        </div>

        <div className='flex flex-column gap-2'>
          <label htmlFor='userid'>소개</label>
          <InputText id='userid' />
        </div>

        <Button
          label='회원가입'
          type='submit'
        />
      </Form>
    </main>
  );
}

export default SignUp;
