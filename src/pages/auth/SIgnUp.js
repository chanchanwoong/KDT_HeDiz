import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import Logo from 'components/common/Logo';
import SignUpForm from 'components/common/SignUpForm';
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

  const [activeIndex, setActiveIndex] = useState(0);

  function handleSubmit({ request }) {
    // const data = request.formData();
    // console.log(data);
    axios
      .get('http://localhost:8080/auth/sign-up/ABC123')
      .then((res) => {
        console.log(res.data);
        // setInfo(res.data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo
        size='text-4xl'
        margin='mb-6'
      />

      <div className='card mt-4 mb-6'>
        <Toast ref={toast}></Toast>
        <Steps
          model={stepItems}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
      </div>

      <div>
        {activeIndex === 0 ? (
          <>
            <Form
              // method='get'
              onSubmit={handleSubmit}
              className='flex flex-column flex-wrap gap-4 mb-4'
            >
              <div className='p-inputgroup flex-1'>
                <InputText
                  id='shop_code'
                  name='shop_code'
                  placeholder='미용실 고유코드'
                />
                <Button
                  label='인증하기'
                  type='submit'
                />
              </div>

              <InputText
                name='shop_name'
                placeholder='상호명'
                disabled
              />
            </Form>

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
            <SignUpForm />
            <Button
              outlined={activeIndex !== 0}
              label='이전 단계'
              onClick={() => setActiveIndex(0)}
              type='button'
            />
          </>
        )}
      </div>
      <Link
        to='/auth/sign-in'
        className='text-blue-500 cursor-pointer mt-4'
      >
        <span className='pi pi-arrow-left'> 로그인페이지</span>
      </Link>
    </main>
  );
}

export default SignUp;

export async function action({ request }) {
  const data = await request.formData();
  console.log(data);
  const shopCode = data.get('shop_code');

  async function getShopname() {
    try {
      const response = await axios.get(
        `http://localhost:8080/auth/sign-up/testcode`
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}
