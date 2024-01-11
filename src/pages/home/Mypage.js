import { useEffect, useState, useRef } from 'react';
import { Form, redirect } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import img from '../../assets/img.jpg';

function Mypage() {
  return (
    <>
      <Panel
        toggleable
        header='프로필'
      >
        <div className='flex'>
          <div className='flex flex-column flex-wrap gap-4 w-4'>
            <div>
              <Image
                className='mr-5'
                src={img}
                alt='Image'
                width='70%'
                height='100%'
              />
              <Button label='프로필 사진 수정' />
            </div>
          </div>
          <div className='flex flex-column flex-wrap gap-4 w-8'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user mr-2'></i>
              </span>
              <InputText placeholder='소속' />
            </div>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user mr-2'></i>
              </span>
              <InputText placeholder='닉네임' />
            </div>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-comment mr-2'></i>
              </span>
              <InputText
                className='min-w-min md:min-w-max'
                placeholder='소개'
              />
            </div>
            <Button label='수정하기' />
          </div>
        </div>
      </Panel>

      <div className='flex col-12'>
        <div className='col-6'>
          <Panel
            toggleable
            header='계정'
          >
            <div className='flex flex-column flex-wrap gap-4'>
              <div className='p-inputgroup flex-1'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-user mr-2'></i>
                </span>
                <InputText placeholder='이름' />
              </div>
              <div className='p-inputgroup flex-1'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-user mr-2'></i>
                </span>
                <InputText placeholder='아이디' />
              </div>
              <div className='p-inputgroup flex-1'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-comment mr-2'></i>
                </span>
                <InputText
                  className='min-w-min md:min-w-max'
                  placeholder='전화번호'
                />
              </div>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_start'
                  placeholder='권한'
                />
              </div>
              <Button label='수정하기' />
            </div>
          </Panel>
        </div>
        <div className='col-6'>
          <Panel
            toggleable
            header='비밀번호'
          >
            <span className='ml-5'>비밀번호 변경</span>
            <div className='flex flex-column gap-4 ml-5'>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_start'
                  placeholder='현재 비밀번호'
                />
              </div>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_start'
                  placeholder='새 비밀번호'
                />
              </div>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_start'
                  placeholder='새 비밀번호 확인'
                />
              </div>
              <Button label='수정하기' />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

export default Mypage;
