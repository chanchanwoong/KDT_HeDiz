import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useLocation, Link } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';

function HairstyleList() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const shop_seq = location.state.shop_seq;
  const shop_name = location.state.shop_name;
  const shop_start = location.state.shop_start;
  const shop_end = location.state.shop_end;

  console.log(shop_start, shop_end);

  useEffect(() => {
    authAxios()
      .get(`home/hairstyle/` + shop_seq)
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
        key={product.style_seq}
      >
        <div
          className={classNames(
            'flex flex-column xl:flex-row xl:align-items-start p-4 gap-4',
            {
              'border-top-1 surface-border': index !== 0,
            }
          )}
        >
          <div className='flex flex-row align-items-center'>
            <Link
              to={`/hairstyle`}
              state={{
                shop_seq: shop_seq,
                shop_name: shop_name,
                shop_start: shop_start,
                shop_end: shop_end,
                style_seq: product.style_seq,
                style_name: product.style_name,
                style_price: product.style_price,
              }}
            >
              <img
                className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
                src={product.style_image}
                alt={product.style_name}
              />
            </Link>
            <div className='flex flex-column ml-4'>
              <Link
                to={`/hairstyle`}
                state={{
                  shop_seq: shop_seq,
                  shop_name: shop_name,
                  shop_start: shop_start,
                  shop_end: shop_end,
                  style_seq: product.style_seq,
                  style_name: product.style_name,
                  style_price: product.style_price,
                }}
              >
                <div className='text-2xl font-bold text-900'>
                  {product.style_name}
                </div>
              </Link>
              <span className='flex align-items-center gap-2'>
                <span className='font-semibold'>{product.style_price}원</span>
              </span>
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
    <div className='card'>
      <DataView
        value={products}
        listTemplate={listTemplate}
      />
    </div>
  );
}

export default HairstyleList;
