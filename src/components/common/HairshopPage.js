import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { classNames } from 'primereact/utils';
import { authAxios } from '../../api/AxiosAPI';
import { useLocation } from 'react-router-dom';

const getRegularDayOff = (value) => {
  const daysOff = value.split(',').map(Number);

  const dayMappings = {
    1: '일요일',
    2: '월요일',
    3: '화요일',
    4: '수요일',
    5: '목요일',
    6: '금요일',
    7: '토요일',
  };
  const dayOffNames = daysOff.map((day) => dayMappings[day]);

  return dayOffNames.length > 0
    ? `정기 휴무일 : ${dayOffNames.join(', ')}`
    : '정기 휴무일 없음';
};

function HairshopPage() {
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const shop_seq = location.state.shop_seq;
  useEffect(() => {
    authAxios()
      .get(`/home/${shop_seq}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const itemTemplate = (product) => {
    return (
      <div className='col-12'>
        <div className='flex flex-column xl:flex-row xl:align-items-start p-4 gap-4'>
          <div className='flex flex-column sm:flex-column justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <img
              className='w-9 sm:w-16rem xl:w-20rem shadow-2 block xl:block mx-auto border-round'
              src={product.shop_image}
            />
            <div className='text-2xl font-bold text-900'>
              {product.shop_name}
            </div>
            <div className='flex'>
              <Rating
                value={product.avg_review_score}
                readOnly
                cancel={false}
              ></Rating>
<p className='ml-2'>({product.count_review})</p>
            </div>
            <span>
              영업 시간 : {product.shop_start} ~ {product.shop_end}
            </span>
            <span>{getRegularDayOff(product.shop_regular)}</span>

            <div>
            <span>{product.shop_intro}</span>
            <i className='pi pi-map-marker'></i>
            </div>
            
          </div>
          <div className='flex flex-column align-items-center sm:align-items-start gap-3'></div>
        </div>
      </div>
    );
  };

  return (
    <div className='card'>
      {product && itemTemplate(product)}
    </div>
  );
}

export default HairshopPage;
