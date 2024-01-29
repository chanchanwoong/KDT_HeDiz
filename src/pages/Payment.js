import React, { useState, useEffect } from 'react';
import { useReservationContext } from 'context/ReservationContext';
import { useNavigate } from 'react-router-dom';
import { authAxios } from 'api/AxiosAPI';
import { BootpayAPI } from 'api/BootpayAPI';
import PaymentInfo from 'components/PaymentInfo';
import {
  formatHourMinute,
  formatNumberWithCommas,
  formatDate,
  formatTime,
  getCustomerLevel,
} from 'utils/util';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Divider } from 'primereact/divider';

function Payment() {
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);
  const [hairstyle, setHairstyle] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reservRequest, setReservRequest] = useState('');
  // 결제금액, 할인가격
  const [payprice, setPayprice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const { custSeq, styleSeq, staffSeq, shopSeq, date, time } =
    useReservationContext();

  useEffect(() => {
    const infoRequest = authAxios().get(`/mypage/profile/${custSeq}`);
    const hairstyleRequest = authAxios().get(
      `/hairshop/${shopSeq}/hairstyle/${styleSeq}`
    );
    const staffRequest = authAxios().get(
      `/hairshop/${shopSeq}/staff/${staffSeq}`
    );

    axios
      .all([infoRequest, hairstyleRequest, staffRequest])
      .then(
        axios.spread((infoRequest, hairstyleRequest, staffRequest) => {
          console.log(infoRequest.data);
          console.log(hairstyleRequest.data);
          setInfo(infoRequest.data);
          setHairstyle(hairstyleRequest.data);
          setStaff(staffRequest.data);

          // 고객 등급에 따른 할인율
          const calculateDiscount = (price, customerLevel) => {
            const discountRates = {
              1: 0.1, // 고객 등급이 1인 경우 10% 할인
            };
            const discountRate = discountRates[customerLevel] || 0;
            const discountedPrice = price * (1 - discountRate);
            const discountAmount = price - discountedPrice;

            // 할인 금액, 결제 금액
            setDiscountAmount(discountAmount);
            setDiscountedPrice(discountedPrice);
            setPayprice(discountedPrice);
            return discountAmount;
          };

          const discountAmount = calculateDiscount(
            hairstyleRequest.data.style_price,
            infoRequest.data.cust_level
          );
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, []);

  const payinfo = {
    style_seq: styleSeq,
    cust_seq: custSeq,
    shop_seq: shopSeq,
    reserv_date: date,
    reserv_time: time,
    staff_seq: staffSeq,
    reserv_request: reservRequest,
    style_name: hairstyle.style_name,
    pay_price: payprice,
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
          navigate('/reservation');
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
      <h3 className='mt-0 mb-4'>결제하기</h3>
      <section className='flex flex-column gap-6'>
        {/* 예약자 정보 */}
        <article className='flex flex-column gap-2'>
          <h4 className='m-0'>예약자</h4>
          <Divider className='my-1' />
          <PaymentInfo
            label='예약자 성함'
            value={info.cust_name}
          />
          <PaymentInfo
            label='연락처'
            value={info.cust_phone}
          />
          <PaymentInfo
            label='고객 등급'
            value={getCustomerLevel(info.cust_level)}
          />
        </article>
        {/* 예약 정보 */}
        <article className='flex flex-column gap-2'>
          <h4 className='m-0'>예약 정보</h4>
          <Divider className='my-1' />
          <PaymentInfo
            label='예약일자'
            value={`${formatDate(date)} ${formatHourMinute(time)}`}
          />
          <PaymentInfo
            label='미용실'
            value={hairstyle.shop_name}
          />
          <PaymentInfo
            label='디자이너'
            value={staff.staff_nickname}
          />
          <PaymentInfo
            label='헤어스타일'
            value={hairstyle.style_name}
          />
          <PaymentInfo
            label='예상 소요시간'
            value={formatTime(hairstyle.style_time)}
          />

          <InputTextarea
            name='reserv_request'
            autoResize
            placeholder='요청사항을 입력해주세요'
            className='text-sm w-full mt-2'
            value={reservRequest}
            onChange={(e) => setReservRequest(e.target.value)}
          />
        </article>
        {/* 결제 정보 */}
        <article className='flex flex-column gap-2'>
          <h4 className='m-0'>결제 정보</h4>
          <Divider className='my-1' />
          <span className='text-color-secondary font-semibold flex justify-content-between'>
            <span className='inline-block w-3'>헤어스타일 가격</span>
            <span className='text-color text-large font-bold'>
              {formatNumberWithCommas(hairstyle.style_price)}
            </span>
          </span>
          <span className='text-color-secondary font-semibold flex justify-content-between'>
            <span className='inline-block w-3'>할인 금액 (-)</span>
            <span className='text-color text-large font-bold'>
              {formatNumberWithCommas(discountAmount)}
            </span>
          </span>
          <Divider className='my-1' />
          <span className='text-color-secondary font-semibold flex justify-content-between'>
            <span className='inline-block w-3'>결제 금액</span>
            <span className='text-color text-xl font-bold'>
              {formatNumberWithCommas(discountedPrice)}
            </span>
          </span>
        </article>
        {/* 유의사항 */}
        <article className='flex flex-column gap-2'>
          <h4 className='m-0'>유의사항</h4>
          <Divider className='my-1' />
          <ul className='text-color-secondary font-semibold text-xs'>
            <li>
              고객님의 헤어상태에 따라 선택한 시술이 불가능하거나 추가 비용이
              발생할 수 있습니다.
            </li>
          </ul>
        </article>
      </section>

      <Button
        label='결제하기'
        className='btn__submit'
        onClick={handleBootpay}
      />
    </div>
  );
}

export default Payment;
