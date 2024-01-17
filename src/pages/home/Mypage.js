import { useEffect, useState, useRef } from 'react';
import { Form, redirect } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import img from '../../assets/img.jpg';

function Mypage() {
  const [displayPasswordModal, setDisplayPasswordModal] = useState(false);
  const [current_passwd, setCurrent_passwd] = useState('');
  const [new_passwd, setNew_passwd] = useState('');
  const [check_passwd, setCheck_passwd] = useState('');
  const token = localStorage.getItem('jwtauthtoken');
  const shop_seq = localStorage.getItem('shop_seq');

  const showDialog = () => {
    setDisplayPasswordModal(true);
  };

  const hideDialog = () => {
    setDisplayPasswordModal(false);
  };

  return (
    <>
      <Form method='get'>
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
                    disabled
                  />
                </div>
              </div>

              <div className='col-12'>
                <Button
                  className='col-6'
                  label='수정하기'
                />
                <Button
                  className='col-6'
                  label='비밀번호 변경'
                  onClick={showDialog}
                />
              </div>
            </div>
          </div>
        </Panel>
      </Form>
      <Dialog
        header='비밀번호 변경'
        visible={displayPasswordModal}
        onHide={hideDialog}
      >
        <div className='flex flex-column gap-4 ml-5'>
          <div className='p-inputgroup'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-clock'></i>
            </span>
            <span className='p-float-label'>
              <Password
                feedback={false}
                inputId='current_passwd'
                value={current_passwd}
                onChange={(e) => setCurrent_passwd(e.target.value)}
              />
              <label htmlFor='current_passwd'>현재 패스워드</label>
            </span>
          </div>
          <div className='p-inputgroup'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-clock'></i>
            </span>
            <span className='p-float-label'>
              <Password
                inputId='new_passwd'
                value={new_passwd}
                onChange={(e) => setNew_passwd(e.target.value)}
              />
              <label htmlFor='new_passwd'>새 패스워드</label>
            </span>
          </div>
          <div className='p-inputgroup'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-clock'></i>
            </span>
            <span className='p-float-label'>
              <Password
                inputId='check_passwd'
                value={check_passwd}
                onChange={(e) => setCheck_passwd(e.target.value)}
                feedback={false}
              />
              <label htmlFor='check_passwd'>새 패스워드 확인</label>
            </span>
          </div>
          <Button
            label='수정하기'
            onClick={hideDialog}
          />
        </div>
      </Dialog>
    </>
  );
}

export default Mypage;
