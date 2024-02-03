import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { formatHourMinute, formatDate } from 'utils/util';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataView } from 'primereact/dataview';
import axios from 'axios';

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [pushCustList, setPushCustList] = useState([]);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'You have accepted',
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: 'You have rejected',
      life: 3000,
    });
  };

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

  ///// 예약 취소를 누를 경우 발생하는 핸들러
  ///// 예약 seq 와 영수증 id를 받아와서 예약 상태를 2로 변경하고 결제를 취소
  const handleReservCancel = (reserv_seq, receipt_id) => {
    console.log(reserv_seq, receipt_id);
    authAxios()
      .put(`mypage/realtime-reservation/${reserv_seq}`, { receipt_id })
      .then((response) => {
        console.log('Auth Response:', response.data);
        // FIREBASE 푸시 알림 로직 response.data에 토큰 정보가 담겨있음
        // setPushCustList(response.data);
        response.data.map((list) => {
          console.log(list);
          let pushinfo = {
            to: list,
            notification: {
              title: 'HeDiz',
              body: '고객님이 설정하신 대기시간의 예약이 취소되었습니다.',
            },
          };

          const header = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.REACT_APP_FIREBASE_AUTH_KEY,
            },
          };
          console.log(process.env.REACT_APP_FIREBASE_AUTH_KEY);
          console.log(pushinfo);

          axios
            .post('https://fcm.googleapis.com/fcm/send', pushinfo, header)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error('FCM 전송 중 오류 발생:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  const confirm = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept,
      reject,
    });
  };

  const itemTemplate = (item, index) => {
    return (
      <article key={item.reserv_seq}>
        <Divider />
        <p className="font-semibold m-0 mb-4 flex justify-content-between">
          <span>
            <i className="pi pi-calendar mr-2"></i>
            {formatDate(item.reserv_date)}
            <span> </span>
            {formatHourMinute(item.reserv_time)}
          </span>
          <span className="text-500">{item.shop_name}</span>
        </p>
        <p className="text-color-secondary font-semibold text-sm m-0 mb-2">
          <span className="inline-block w-2">디자이너</span>
          <span className="text-color">{item.staff_nickname}</span>
        </p>
        <p className="text-color-secondary font-semibold text-sm m-0 mb-2">
          <span className="inline-block w-2">헤어스타일</span>
          <span className="text-color">{item.style_name}</span>
        </p>
        <p className="text-color-secondary font-semibold text-sm m-0 mb-4">
          <span className="inline-block w-2">요청사항</span>
          <span className="text-color">{item.reserv_request}</span>
        </p>
        <div className="flex justify-content-end gap-2">
          <Button
            label="예약취소"
            type="submit"
            size="small"
            className="py-2"
            onClick={() => handleReservCancel(item.reserv_seq, item.receipt_id)}
          />
          <ConfirmDialog />
        </div>
      </article>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <>{list}</>;
  };

  return (
    <>
      <h3 className="mt-0 mb-4">
        <span>예약확인</span>
        <span className="text-500 text-sm ml-2">총 {reservations.length} 건</span>
      </h3>
      <DataView
        value={reservations}
        listTemplate={listTemplate}
      />
      {/* {reservations.map((item) => (
        <article key={item.reserv_seq}>
          <Divider />
          <p className='font-semibold m-0 mb-4 flex justify-content-between'>
            <span>
              <i className='pi pi-calendar mr-2'></i>
              {formatDate(item.reserv_date)}
              <span> </span>
              {formatHourMinute(item.reserv_time)}
            </span>
            <span className='text-500'>{item.shop_name}</span>
          </p>
          <p className='text-color-secondary font-semibold text-sm m-0 mb-2'>
            <span className='inline-block w-2'>디자이너</span>
            <span className='text-color'>{item.staff_nickname}</span>
          </p>
          <p className='text-color-secondary font-semibold text-sm m-0 mb-2'>
            <span className='inline-block w-2'>헤어스타일</span>
            <span className='text-color'>{item.style_name}</span>
          </p>
          <p className='text-color-secondary font-semibold text-sm m-0 mb-4'>
            <span className='inline-block w-2'>요청사항</span>
            <span className='text-color'>{item.reserv_request}</span>
          </p>
          <div className='flex justify-content-end gap-2'>
            <Button
              label='예약취소'
              type='submit'
              size='small'
              className='py-2'
              // onClick={() =>
              //   handleReservCancel(item.reserv_seq, item.receipt_id)
              // }
              onClick={confirm}
            />
            <ConfirmDialog />
          </div>
        </article>
      ))} */}
    </>
  );
}

export default Reservation;
