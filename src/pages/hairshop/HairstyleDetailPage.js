import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import ReviewList from '../../components/common/ReviewList';
import HairstylePage from '../../components/common/HairstylePage';
import { useLocation } from 'react-router-dom';
import ReservationButton from '../../components/common/ReservationButton';
import { Button } from 'primereact/button';
import BootpayAPI from '../../api/BootpayAPI';

function HairshopDetailPage() {
  const location = useLocation();
  const style_name = location.state.style_name;
  console.log('style이름', style_name);
  let payinfo = {
    style_name: style_name,
    stlye_price: 200,
  };

  const handleBootpay = async () => {
    console.log(payinfo);
    try {
      await BootpayAPI({ payinfo });

      // 부트페이 API가 성공적으로 완료될 때 수행할 작업 추가
    } catch (error) {
      // 부트페이 API 호출 중 예외 발생 시 수행할 작업 추가
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };
  return (
    <>
      <HairstylePage />
      <Divider />

      <Panel
        header='리뷰'
        title='리뷰'
        toggleable
      >
        <ReviewList style_name={style_name} />
      </Panel>

      <Button onClick={handleBootpay}>예약 하기</Button>
    </>
  );
}

export default HairshopDetailPage;
