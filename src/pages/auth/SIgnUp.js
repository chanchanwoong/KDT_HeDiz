import { useState } from 'react';

import Logo from 'components/common/Logo';
import { Form } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

function SignUp() {
  const [value, setValue] = useState('');

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      <Logo />

      <Form
        // method='post'
        action='/'
        className='flex flex-column flex-wrap gap-3'
      >
        <h1>일반 회원가입</h1>

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

        <Button
          label='회원가입'
          type='submit'
        />
      </Form>
    </main>
  );
}

export default SignUp;
