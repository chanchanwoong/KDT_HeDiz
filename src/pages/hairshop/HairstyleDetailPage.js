import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import ReviewList from 'components/common/ReviewList';
import HairstylePage from 'components/common/HairstylePage';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';

function HairstyleDetailPage() {
  /// 예약 페이지에서 필요한 데이터들
  const location = useLocation();
  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  const style_price = location.state.style_price;
  const shop_name = location.state.shop_name;
  const shop_start = location.state.shop_start;
  const shop_end = location.state.shop_end;
  console.log('style이름', style_name);

  return (
    <>
      <HairstylePage />
      <Divider />

      <Panel
        header="리뷰"
        title="리뷰"
        toggleable
      >
        <ReviewList style_name={style_name} />
      </Panel>
      {/*url 이동할 때 state에 값을 저장하여 보내기 */}
      <Link
        to="/hairshop/reservation"
        state={{
          style_name: style_name,
          shop_seq: shop_seq,
          style_seq: style_seq,
          style_price: style_price,
          shop_name: shop_name,
          shop_start: shop_start,
          shop_end: shop_end,
        }}
      >
        <Button>예약하기</Button>
      </Link>
    </>
  );
}

export default HairstyleDetailPage;
