import { useEffect, useState, useRef } from 'react';
import { Form, redirect } from 'react-router-dom';
import axios from 'axios';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

function Info() {
  const [info, setInfo] = useState([]);
  const [selectedTags, setSelectedTags] = useState(null);
  const [time, setTime] = useState(null);
  const [selectClosedDay, setSelectClosedDay] = useState(null);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: 'info',
      summary: '수정 성공',
      detail: '수정 성공하였습니다.',
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: 'warn',
      summary: '수정 실패',
      detail: '수정에 실패했습니다. 다시 시도해주세요.',
      life: 3000,
    });
  };

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

  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/info/1')
      .then((res) => {
        console.log(res.data);
        setInfo(res.data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }, []);

  return (
    <>
      <Panel
        header={info.shop_name}
        toggleable
      >
        <div className='card flex flex-column md:flex-row gap-3'>
          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-user mr-2'></i> 사업자 등록번호
            </span>
            <InputText
              placeholder='사업자 등록번호'
              value={info.shop_register}
              disabled
            />
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-code mr-2'></i> 미용실 고유코드
            </span>
            <InputText
              placeholder='미용실 고유코드'
              value={info.shop_code}
              disabled
            />
            <span className='p-inputgroup-addon'>
              <i className='pi pi-clone'></i>
            </span>
          </div>
        </div>
      </Panel>

      <Panel
        header='미용실 정보 수정'
        toggleable
      >
        <Form
          method='post'
          className='flex flex-column flex-wrap gap-4'
        >
          <div className='card flex flex-column gap-3'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-calendar-minus'></i>
              </span>
              <MultiSelect
                value={selectClosedDay}
                onChange={(e) => setSelectClosedDay(e.value)}
                options={closedDay}
                optionLabel='name'
                placeholder='정기 휴무일'
                className='w-full md:w-20rem'
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-map'></i>
              </span>
              <InputText
                name='shop_address'
                placeholder='주소'
                defaultValue={info.shop_address}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-phone'></i>
              </span>
              <InputText
                name='shop_phone'
                placeholder='미용실 전화번호'
                defaultValue={info.shop_phone}
              />
            </div>

            <div className='flex gap-3'>
              <div className='p-inputgroup flex-1'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_start'
                  placeholder='영업 시작시간'
                  defaultValue={info.shop_start}
                />
                {/* <Calendar
                  id='calendar-timeonly'
                  name={info.shop_start}
                  defaultValue={info.shop_start}
                  onChange={(e) => setTime(e.value)}
                  placeholder='영업 시작 시간 test'
                  timeOnly
                  type='time'
                /> */}
              </div>

              <div className='p-inputgroup flex-1'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-clock'></i>
                </span>
                <InputText
                  name='shop_end'
                  placeholder='영업 종료시간'
                  defaultValue={info.shop_end}
                />
                {/* <Calendar
                  id='calendar-timeonly'
                  name={info.shop_end}
                  defaultValue={info.shop_start}
                  onChange={(e) => setTime(e.value)}
                  placeholder='영업 종료 시간'
                  timeOnly
                />*/}
              </div>
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-code'></i>
              </span>
              {/* <InputText
                placeholder='해시태그'
                // value={info.shop_code}
              /> */}
              <MultiSelect
                value={selectedTags}
                onChange={(e) => setSelectedTags(e.value)}
                options={hashTag}
                optionLabel='name'
                display='chip'
                placeholder='해시태그'
                // maxSelectedLabels={3}
                className='w-full md:w-20rem'
                filter
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-comment'></i>
              </span>
              <InputTextarea
                placeholder='미용실 소개글'
                defaultValue={info.shop_intro}
                rows={10}
              />
            </div>
          </div>

          <Toast ref={toast} />
          <ConfirmDialog
            group='declarative'
            visible={visible}
            onHide={() => setVisible(false)}
            message='정말 수정하시겠습니까?'
            header='수정하기'
            icon='pi pi-exclamation-triangle'
            accept={accept}
            reject={reject}
          />
          <div className='card flex justify-content-center'>
            <Button
              onClick={() => setVisible(true)}
              icon='pi pi-check'
              label='수정하기'
              type='submit'
            />
          </div>
          {/* <Button
            label='수정하기'
            type='submit'
          /> */}
        </Form>
      </Panel>
    </>
  );
}

export default Info;

export async function action({ request }) {
  console.log('수정');
  const formData = await request.formData();
  const postData = Object.fromEntries(formData); // { body: '...', author: '...' }
  console.log(postData);
  await fetch('http://localhost:8080/hairshop/info', {
    method: 'PUT',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return redirect('/hairshop/info');
}
