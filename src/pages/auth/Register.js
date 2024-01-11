import { useState } from 'react';

import { Steps } from 'primereact/steps';
import { Form, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

function Register() {
  const [activeIndex, setActiveIndex] = useState(0);

  const stepItems = [
    { label: '사업자등록번호 인증' },
    { label: '미용실 정보' },
    { label: '회원가입 정보' },
  ];

  const firstTemplate = () => {
    return <div>첫번째</div>;
  };

  const secondTemplate = () => {
    return <div>두번째</div>;
  };

  const thirdTemplate = () => {
    return <div>세번째</div>;
  };

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg'>
      {/* 로고 컴포넌트 분리 필요 */}
      <span className='flex align-items-center justify-content-center gap-1 mb-4'>
        <span className='font-medium text-4xl font-bold'>
          He<span className='text-primary'>Diz</span> - 미용실 등록
        </span>
      </span>

      <div className='card mb-6'>
        <div className='flex flex-wrap justify-content-end gap-2 mb-3'>
          <Button
            outlined={activeIndex !== 0}
            rounded
            label='1'
            onClick={() => setActiveIndex(0)}
            className='w-2rem h-2rem p-0'
          />
          <Button
            outlined={activeIndex !== 1}
            rounded
            label='2'
            onClick={() => setActiveIndex(1)}
            className='w-2rem h-2rem p-0'
          />
          <Button
            outlined={activeIndex !== 2}
            rounded
            label='3'
            onClick={() => setActiveIndex(2)}
            className='w-2rem h-2rem p-0'
          />
        </div>
        <Steps
          model={stepItems}
          activeIndex={activeIndex}
        />
      </div>

      <Form
        // method='post'
        action='/'
        className='flex flex-row flex-wrap gap-6 col-md-12'
      >
        <div className='flex flex-column gap-4'>
          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>사업자 등록번호</label>
            <div className='p-inputgroup flex-1'>
              <InputNumber />
              <Button
                label='인증하기'
                type='button'
              />
            </div>
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>미용실 고유코드</label>
            <InputText
              id='userid'
              disabled
            />
          </div>

          <Button
            label='다음 단계'
            type='submit'
          />
        </div>
      </Form>

      {/* <Form
        // method='post'
        action='/'
        className='flex flex-row flex-wrap gap-6 col-md-12'
      >
        <div className='col-md-6 flex flex-column gap-4'>
          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>사업자 등록번호</label>
            <div className='p-inputgroup flex-1'>
              <InputNumber />
              <Button
                label='인증하기'
                type='button'
              />
            </div>
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>미용실 고유코드</label>
            <InputText
              id='userid'
              disabled
            />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>상호명</label>
            <InputText
              id='userid'
              disabled
            />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>주소</label>
            <InputText id='userid' />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>전화번호</label>
            <InputText id='userid' />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>미용실 소개</label>
            <InputTextarea rows={5} />
          </div>
        </div>

        <div className='col-md-6 flex flex-column gap-2'>
          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>정기 휴무</label>
            <InputText id='userid' />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>영업 시간</label>
            <InputText id='userid' />
          </div>

          <div className='flex flex-column gap-2'>
            <label htmlFor='userid'>미용실 해시태그</label>
            <InputText id='userid' />
          </div>

          <Button
            label='다음 단계'
            type='submit'
          />
        </div>
      </Form> */}
    </main>
  );
}

export default Register;
