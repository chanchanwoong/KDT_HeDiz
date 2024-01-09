import { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import axios from 'axios';
import { BreadCrumb } from 'primereact/breadcrumb';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

function Info() {
  const items = [{ label: '미용실 관리' }, { label: '미용실 정보' }];
  const home = { icon: 'pi pi-home', url: '/hairshop' };

  const [info, setInfo] = useState([]);

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
      <BreadCrumb
        model={items}
        home={home}
        className='mb-2'
      />
      <section className='flex flex-column bg-white w-auto p-4 border-round-lg'>
        <h2>{info.shop_name}</h2>
        <div className='card flex flex-column md:flex-row gap-3'>
          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-user mr-2'></i> 사업자 등록 번호
            </span>
            <InputText
              placeholder='Username'
              value={info.shop_register}
              disabled
            />
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-code mr-2'></i> 미용실 고유코드
            </span>
            <InputText
              placeholder='Price'
              value={info.shop_code}
              disabled
            />
            <span className='p-inputgroup-addon'>
              <i className='pi pi-clone'></i>
            </span>
          </div>
        </div>

        <Divider />
        <Form method="post  className='flex flex-column flex-wrap gap-4'">
          <div className='card flex flex-column gap-3'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-calendar-minus'></i>
              </span>
              <InputText placeholder='정기 휴무일' />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-map'></i>
              </span>
              <InputText
                placeholder='주소'
                defaultValue={info.shop_address}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-phone'></i>
              </span>
              <InputText
                placeholder='미용실 전화번호'
                defaultValue={info.shop_phone}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-comment'></i>
              </span>
              <InputText
                placeholder='미용실 소개글'
                defaultValue={info.shop_intro}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-clock'></i>
              </span>
              <InputText
                placeholder='영업 시작 시간'
                defaultValue={info.shop_start}
                // value={info.shop_code}
              />
            </div>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-clock'></i>
              </span>
              <InputText
                placeholder='영업 종료 시간'
                defaultValue={info.shop_end}
                // value={info.shop_code}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-code'></i>
              </span>
              <InputText
                placeholder='해시태그'
                // value={info.shop_code}
              />
            </div>
          </div>

          <Button
            label='수정하기'
            type='submit'
          />
        </Form>
      </section>
    </>
  );
}

export default Info;
