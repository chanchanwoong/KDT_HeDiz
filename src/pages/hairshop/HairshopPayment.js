import { Panel } from 'primereact/panel';
import { useLocation } from 'react-router-dom';

function HairshopPayment() {
  const location = useLocation();
  const cust_name = location.state.cust_name;
  const reserv_date = location.state.reserv_date;
  const reserv_time = location.state.reserv_time;
  const shop_name = location.state.shop_name;
  const staff_nickname = location.state.staff_nickname;
  const style_name = location.state.style_name;
  const style_price = location.state.style_price;

  return (
    <>
      <h2>결제하기</h2>
      <Panel
        header='예약정보'
        className='flex flex-column'
      >
        <span>{cust_name} </span>
        <span>{reserv_date} </span>
        <span>{reserv_time} </span>
        <span>{shop_name} </span>
        <span>{staff_nickname} </span>
        <span>{style_name} </span>
        <span>{style_price} </span>
      </Panel>
    </>
  );
}

export default HairshopPayment;
