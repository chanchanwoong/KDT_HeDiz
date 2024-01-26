import { Panel } from 'primereact/panel';
import { useLocation } from 'react-router-dom';
import BootpayAPI from '../../api/BootpayAPI';
import { Button } from 'primereact/button';
import { authAxios } from '../../api/AxiosAPI';

function HairshopPayment() {
  const location = useLocation();
  const cust_name = location.state.cust_name;
  const reserv_date = location.state.reserv_date;
  const reserv_time = location.state.reserv_time;
  const shop_name = location.state.shop_name;
  const staff_nickname = location.state.staff_nickname;
  const style_name = location.state.style_name;
  const style_price = location.state.style_price;
  const shop_seq = location.state.shop_seq;

  let payinfo = {
    style_name: style_name,
    stlye_price: style_price,
    cust_seq: localStorage.getItem('cust_seq'),
    shop_seq: shop_seq,
    pay_price: style_price,
  };

  const handleBootpay = async () => {
    console.log(payinfo);
    try {
      await BootpayAPI({ payinfo });
      authAxios()
        .post('/home/payment', payinfo)
        .then((response) => {
          console.log('Response Data:', response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };

  return (
    <>
      <h2>결제하기</h2>
      <Panel header='예약정보'>
        <div className='flex flex-column font-semibold'>
          <span>구매자 이름 : {cust_name} </span>
          <span>예약 날짜 : {reserv_date} </span>
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
