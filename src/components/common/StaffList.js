import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useLocation } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';

function StaffList() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const shop_seq = location.state.shop_seq;

  useEffect(() => {
    authAxios()
      .get(`home/hairshop/staff/` + shop_seq)
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
        key={product.staff_seq}
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
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={product.staff_image}
            alt={product.staff_nickname}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>
                {product.staff_nickname}
              </div>

              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <span className='font-semibold'>{product.staff_role}</span>
                </span>
              </div>
              <span>{product.staff_intro}</span>
            </div>
            <div className='flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2'></div>
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
    <div className='card'>
      <DataView
        value={products}
        listTemplate={listTemplate}
      />
    </div>
  );
}

export default StaffList;
