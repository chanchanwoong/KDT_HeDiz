import { useState } from 'react';
import Logo from 'components/common/Logo';
import SignUpForm from 'components/common/SignUpForm';

import { Steps } from 'primereact/steps';
import { Form, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

function Register() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState(null);
  const [selectClosedDay, setSelectClosedDay] = useState(null);
  const [value, setValue] = useState();
  const [time, setTime] = useState(null);

  const stepItems = [
    { label: '사업자등록번호 인증' },
    { label: '미용실 정보' },
    { label: '회원가입 정보' },
  ];

  const hashTag = [
    { name: 'Wifi' },
    { name: '간식' },
    { name: '1인샵' },
    { name: '바버샵' },
    { name: '메이크업 가능' },
    { name: '반려견 동반 가능' },
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

  return (
    <main className='flex flex-column bg-white p-6 w-auto border-round-lg w-4'>
      {/* 로고 컴포넌트 분리 필요 */}
      <span className='flex align-items-center justify-content-center gap-1 mb-2'>
        <span className='font-medium text-4xl font-bold'>
          He<span className='text-primary'>Diz</span>
        </span>
      </span>

      <p className='font-medium font-bold text-center'>
        미용실 등록(점주 회원가입)
      </p>

      <div className='card my-4'>
        <div className='flex flex-wrap justify-content-end gap-2 mb-6'>
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
        {/* {activeIndex === 0 ? (
          <h1>1번</h1>
        ) : activeIndex === 1 ? (
          <h2>2번</h2>
        ) : (
          <h2>3번</h2>
        )} */}
        {activeIndex === 0 ? (
          <>
            <div className='flex flex-column gap-4 min-w-full'>
              <div className='p-inputgroup flex-1'>
                <InputMask
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  mask='999-99-99999'
                  placeholder='사업자등록번호'
                  name='shop_register'
                />
                <Button
                  label='인증하기'
                  type='button'
                />
              </div>

              <InputText
                name='shop_code'
                placeholder='미용실 고유코드'
                disabled
              />

              <Button
                label='다음 단계'
                type='button'
                className='mt-4'
              />
            </div>
          </>
        ) : activeIndex === 1 ? (
          <>
            <div className='flex flex-row gap-4 min-w-full'>
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

                <MultiSelect
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(e.value)}
                  options={hashTag}
                  optionLabel='name'
                  display='chip'
                  placeholder='해시태그'
                  className='w-full'
                  filter
                />
              </div>
              <div className='col-md-6 flex flex-column gap-4'>
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
                  value={selectClosedDay}
                  onChange={(e) => setSelectClosedDay(e.value)}
                  options={closedDay}
                  optionLabel='name'
                  placeholder='정기 휴무일'
                  className='w-full'
                />
                <InputTextarea
                  name='shop_intro'
                  placeholder='미용실 소개글'
                  rows={3}
                />
              </div>
            </div>

            <Button
              label='다음 단계'
              type='button'
              className='mt-4'
            />
          </>
        ) : (
          <SignUpForm />
        )}
      </Form>
    </main>
  );
}

export default Register;
