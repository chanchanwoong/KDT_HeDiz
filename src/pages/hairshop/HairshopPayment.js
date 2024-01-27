import React, { useState } from 'react';
import { Panel } from 'primereact/panel';
import { useLocation } from 'react-router-dom';
import { BootpayAPI } from '../../api/BootpayAPI';
import { Button } from 'primereact/button';
import { authAxios } from '../../api/AxiosAPI';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate } from 'react-router-dom';

function HairshopPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const cust_name = location.state.cust_name;
  const reserv_date = location.state.reserv_date;
  const reserv_time = location.state.reserv_time;
  const shop_seq = location.state.shop_seq;
  const shop_name = location.state.shop_name;
  const staff_seq = location.state.staff_seq;
  const staff_nickname = location.state.staff_nickname;
  const style_seq = location.state.style_seq;
  const style_name = location.state.style_name;
  const style_price = location.state.style_price;
  const [reservRequest, setReservRequest] = useState('');
  const [receiptID, setReceiptID] = useState('');
  ////////////// 백엔드 서버에 보낼 정보들
  const payinfo = {
    style_seq: style_seq,
    style_name: style_name,
    style_price: style_price,
    staff_seq: staff_seq,
    cust_seq: localStorage.getItem('cust_seq'),
    shop_seq: shop_seq,
    reserv_request: reservRequest,
    reserv_date: reserv_date,
    reserv_time: reserv_time,
    pay_price: style_price,
    reserv_stat: '',
    receipt_id: '',
  };
  ////////////// axios 요청
  const handleBootpay = async () => {
    try {
      const response = await BootpayAPI({ payinfo });
      console.log(response.data);
      const receipt_id = response.data.receipt_id;
      console.log(response.data.receipt_id);
      console.log(receipt_id);

      // 결제에 성공하면 예약 목록에 예약 추가
      const request1 = authAxios().post('/home/reservation', {
        ...payinfo,
        reserv_stat: 0, // reserv_stat : 0 예약 완료로 인설트
        receipt_id: receipt_id,
      });
      console.log(request1);
      console.log(payinfo);
      // 결제에 성공하면 결제 테이블에 컬럼 추가
      const request2 = authAxios().post('/home/payment', payinfo);

      axios
        .all([request1, request2])
        .then(
          axios.spread((res1, res2) => {
            console.log('Response from request1:', res1);
            console.log('Response from request2:', res2);
            console.log('Response from request1:', res1.data);
            console.log('Response from request2:', res2.data);
          }),

          navigate('/reservation')
        )
        .catch((error) => {
          console.error('axios 요청 중 오류:', error);
        });
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };

  return (
    <>
      <h2>결제하기</h2>
      <Panel header="예약정보">
        <div className="flex flex-column font-semibold">
          <span>구매자 이름 : {cust_name} </span>
          <span>예약 날짜 : {reserv_date} </span>
          <div className="flex ">
            요청 사항 :
            <InputTextarea
              name="reserv_request"
              value={reservRequest}
              onChange={(e) => setReservRequest(e.target.value)}
            />
          </div>
          <span>예약 시간 : {reserv_time} </span>
          <span>매장 이름 : {shop_name} </span>
          <span>담당 디자이너 : {staff_nickname} </span>
          <span>스타일 이름 : {style_name} </span>
          <span>가격 : {style_price} </span>
        </div>
      </Panel>
      <Button onClick={handleBootpay}>결제 하기</Button>
    </>
  );
}

export default HairshopPayment;
