import React, { useState, useRef } from 'react';
import { Form, Link, redirect } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';

export default function SignUpForm() {
  const [value, setValue] = useState('');
  return (
    <Form
      method='post'
      action='/'
      className='flex flex-column flex-wrap gap-4'
    >
      <div className='flex gap-3'>
        <div className='col-6 flex flex-column flex-wrap gap-4'>
          <div className='p-inputgroup'>
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
        </div>
        <div className='col-6 col-6 flex flex-column flex-wrap gap-4'>
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
            name='shop_image'
            url={'/api/upload'}
            multiple
            accept='image/*'
            maxFileSize={1000000}
            emptyTemplate={<p className='m-0'>미용실 사진을 등록해주세요</p>}
          />
        </div>
      </div>

      <Button
        label='회원가입'
        type='submit'
        className='mb-4'
      />
    </Form>
  );
}
