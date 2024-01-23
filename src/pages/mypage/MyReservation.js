import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { authAxios } from '../../api/AxiosAPI';
import { Panel } from 'primereact/panel';
import { Rating } from 'primereact/rating';

function MyReservation() {
  const [products, setProducts] = useState([]);
  console.log(localStorage.getItem('cust_seq'));
  useEffect(() => {
    authAxios()
      // .get(`mypage/reservation/${localStorage.getItem('cust_seq')}`)
      .get(`mypage/reservation/1`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const itemTemplate = (product, index) => {
    return (
      <div
        className='col-12'
        key={product.reserv_seq}
      >
        <div
          className={classNames(
            'flex flex-column xl:flex-row xl:align-items-start p-4 gap-4',
            {
              'border-top-1 surface-border': index !== 0,
            }
          )}
        >
          <img
            className='w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={product.shop_image}
            alt={product.shop_image}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>
                {product.shop_name}
              </div>
              <span>{product.staff_nickname}</span>
              <div>
                <span className='mr-3'>{product.reserv_date}</span>
                <span>{product.reserv_time}</span>
              </div>
              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <span className='font-semibold'>{product.style_name}</span>
                </span>
              </div>
              <span>{product.review_content}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <div className='grid grid-nogutter'>{list}</div>;
  };

  return (
    <Panel header='내 예약 내역'>
      <div className='card'>
        <DataView
          value={products}
          listTemplate={listTemplate}
          emptyMessage='현재 예약된 내역이 없네요 :) 예약을 시작해보세요!'
        />
      </div>
    </Panel>
  );
}

export default MyReservation;
