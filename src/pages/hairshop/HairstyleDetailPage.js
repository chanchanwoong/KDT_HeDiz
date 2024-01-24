import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import ReviewList from '../../components/common/ReviewList';
import HairstylePage from '../../components/common/HairstylePage';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';

function HairshopDetailPage() {
  const location = useLocation();
  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  console.log('style이름', style_name);

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

      <Link
        to='/hairshop/reservation'
        state={{
          style_name: style_name,
          shop_seq: shop_seq,
          style_seq: style_seq,
        }}
      >
        <Button>예약하기</Button>
      </Link>
    </>
  );
}

export default HairshopDetailPage;
