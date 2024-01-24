import React, { useState } from 'react';
import { Button } from 'primereact/button';
import BootpayAPI from '../../api/BootpayAPI';
import { useLocation } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';
import { Panel } from 'primereact/panel';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';

function HairshopReservation() {
  const [designerReserveTime, setDesignerReserveTime] = useState();
  const location = useLocation();
  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  console.log(style_name, shop_seq, style_seq);
  const [selectedDate, setSelectedDate] = useState(null);
  console.log(selectedDate);

  /// 날짜 선택 ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const currentDate = new Date();
  const twoWeeksLater = new Date(
    currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  const handleDateClick = (date) => {
    setSelectedDate(date);

    authAxios()
      // .get(`hairshop/reservation/${shop_seq}/${style_seq}/${selectedDate}`)
      .get(`hairshop/reservation/1/44/2024-01-30`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setDesignerReserveTime(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  const renderDateOptions = () => {
    const dates = [];
    let currentDate = new Date();

    while (currentDate <= twoWeeksLater) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map((date) => (
      <Button
        key={date}
        onClick={() => handleDateClick(date)}
        style={{
          display: 'inline-block',
          marginRight: '10px',
          border: selectedDate === date ? '1px solid blue' : '1px solid black',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        {date}
      </Button>
    ));
  };
  ///// 부트페이  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let payinfo = {
    style_name: style_name,
    stlye_price: 200,
  };

  const handleBootpay = async () => {
    console.log(payinfo);
    try {
      await BootpayAPI({ payinfo });
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            <img
              className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
              src={product.style_image}
              alt={product.style_name}
            />
            <div className='flex flex-column ml-4'>
              <div className='text-2xl font-bold text-900'>
                {product.style_name}
              </div>
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
    <div>
      <Panel header='예약하기'>
        <div>{style_name}</div>
      </Panel>
      <label htmlFor='dateSelect'>날짜 선택:</label>
      <div>{renderDateOptions()}</div>

      <Panel>
        <div className='card'>
          <DataView
            value={designerReserveTime}
            listTemplate={listTemplate}
          />
        </div>
      </Panel>

      <Button onClick={handleBootpay}>결제 하기</Button>
    </div>
  );
}

export default HairshopReservation;
