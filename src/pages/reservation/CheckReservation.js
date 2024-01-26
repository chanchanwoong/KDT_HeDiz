import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { authAxios } from '../../api/AxiosAPI';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { BootpayCancelAPI } from '../../api/BootpayAPI';
import { useLocation } from 'react-router-dom';

function CheckReservation() {
  const [reservations, setReservations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    authAxios()
      .get(`mypage/realtime-reservation/${localStorage.getItem('cust_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservations(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const handleReservCancel = async (reserv_seq) => {
    authAxios()
      .put(`mypage/realtime-reservation/${reserv_seq}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
    try {
      await BootpayCancelAPI();
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };

  const itemTemplate = (reservation, index) => {
    return (
      <div
        className='col-12'
        key={reservation.style_seq}
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
              src={reservation.shop_image}
              alt={reservation.shop_name}
            />
            <div className='flex flex-column ml-4'>
              <div className='text-2xl font-bold text-900'>
                {reservation.shop_name}
              </div>
              <span className='flex align-items-center gap-2'>
                <div className='flex flex-column'>
                  <span className='font-semibold'>
                    예약한 스타일 : {reservation.style_name}
                  </span>
                  <span>담당 디자이너 : {reservation.staff_nickname}</span>
                  <span>예약 날짜 : {reservation.reserv_date}</span>
                  <span>예약 시간 : {reservation.reserv_time}</span>
                </div>
                <Button onClick={handleReservCancel(reservation.reserv_seq)}>
                  예약 취소
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return `현재 예약중인 가게가 없어요 :)`;

    let list = items.map((reservation, index) => {
      return itemTemplate(reservation, index);
    });

    return <div className='grid grid-nogutter'>{list}</div>;
  };

  return (
    <Panel header='현재 예약 중인 가게'>
      <div className='card'>
        <DataView
          value={reservations}
          listTemplate={listTemplate}
        />
      </div>
    </Panel>
  );
}

export default CheckReservation;
