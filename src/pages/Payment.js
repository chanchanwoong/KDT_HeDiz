import React, { useState, useEffect } from 'react';
import { useReservationContext } from 'context/ReservationContext';
import { useNavigate } from 'react-router-dom';
import { authAxios } from 'api/AxiosAPI';
import { BootpayAPI } from 'api/BootpayAPI';
import { formatHourMinute, formatNumberWithCommas } from 'utils/util';
import { Panel } from 'primereact/panel';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

function Payment() {
  const navigate = useNavigate();
  const [hairstyle, setHairstyle] = useState([]);

  const { custSeq, styleSeq, staffSeq, shopSeq, date, time } =
    useReservationContext();
  const [reservRequest, setReservRequest] = useState('');

  useEffect(() => {
    const saveReservationToLocalStorage = () => {
      const reservation = {
        custSeq,
        styleSeq,
        staffSeq,
        shopSeq,
        date,
        time,
      };
      localStorage.setItem('reservation', JSON.stringify(reservation));
    };

    authAxios()
      .get(`/hairshop/${shopSeq}/hairstyle/${styleSeq}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setHairstyle(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });

    saveReservationToLocalStorage();
  }, [custSeq, styleSeq, staffSeq, shopSeq, date, time]);

  const payinfo = {
    style_seq: styleSeq,
    cust_seq: custSeq,
    shop_seq: shopSeq,
    reserv_date: date,
    reserv_time: time,
    staff_seq: staffSeq,
    reserv_request: reservRequest,
    style_name: hairstyle.style_name,
    pay_price: hairstyle.style_price,
    reserv_stat: '',
    receipt_id: '', // 결제 취소에 사용할 영수증 id (결제 완료 시 발급됨)
  };

  const handleBootpay = async () => {
    console.log(payinfo);
    try {
      const response = await BootpayAPI({ payinfo });
      console.log(response.data);
      const receipt_id = response.data.receipt_id;
      console.log(response.data.receipt_id);
      console.log(receipt_id);
      authAxios()
        .post('/reservation', {
          ...payinfo,
          reserv_stat: 0, // reserv_stat : 0 예약 완료로 인설트
          receipt_id: receipt_id,
        })
        .then(() => {
          clearReservationFromLocalStorage();
          // navigate('/reservation')
        })
        .catch((error) => {
          console.error('axios 요청 중 오류:', error);
        });
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };

  // 결제 완료 후 예약 정보 삭제
  const clearReservationFromLocalStorage = () => {
    localStorage.removeItem('reservation');
  };

  return (
    <div>
      <Panel header='예약자 정보'>
        <ul className='flex flex-column gap-2'></ul>
      </Panel>
      <h1>결제 페이지</h1>
      <h1>예약 정보</h1>
      <p>Shop Seq: {shopSeq}</p>
      <p>Staff seq: {staffSeq}</p>
      <p>Style Seq: {styleSeq}</p>
      <p>Style Name: {hairstyle.style_name}</p>
      <p>Style Price: {formatNumberWithCommas(hairstyle.style_price)}</p>
      <p>Reserv date: {date}</p>
      <p>Reserv Time: {formatHourMinute(time)}</p>
      <p>Cust seq: {custSeq}</p>

      <div className='flex '>
        요청 사항 :
        <InputTextarea
          name='reserv_request'
          value={reservRequest}
          onChange={(e) => setReservRequest(e.target.value)}
        />
      </div>
      <Button
        label='결제하기'
        className='btn__submit'
        onClick={handleBootpay}
      />
    </div>
  );
}

export default Payment;
