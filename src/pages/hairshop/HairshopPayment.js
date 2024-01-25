import { Panel } from 'primereact/panel';
import { useLocation } from 'react-router-dom';

function HairshopPayment() {
  const location = useLocation();
  const reserv_date = location.state.reserv_date;
  const reserv_time = location.state.reserv_time;
  const cust_name = location.state.cust_name;

  return (
    <>
      <h2>결제하기</h2>
      <Panel header='예약정보'></Panel>
    </>
  );
}

export default HairshopPayment;
