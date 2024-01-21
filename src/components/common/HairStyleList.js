import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useLocation } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';

function HairStyleList() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const shop_seq = location.state.shop_seq;

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
        className="col-12"
        key={product.style_seq}
      >
        <div
          className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', {
            'border-top-1 surface-border': index !== 0,
          })}
        >
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={product.style_image}
            alt={product.style_name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{product.style_name}</div>

              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <span className="font-semibold">{product.style_price}원</span>
                </span>
              </div>
              <span>시술 대상 : {product.style_gender}</span>
              <span>소요 시간 : {product.style_time}</span>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"></div>
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

    return <div className="grid grid-nogutter">{list}</div>;
  };

  return (
    <div className="card">
      <DataView
        value={products}
        listTemplate={listTemplate}
      />
    </div>
  );
}

export default HairStyleList;
