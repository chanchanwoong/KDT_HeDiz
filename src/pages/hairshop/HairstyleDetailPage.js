import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import ReviewList from '../../components/common/ReviewList';
import HairstylePage from '../../components/common/HairstylePage';
import { useLocation } from 'react-router-dom';
import ReservationButton from '../../components/common/ReservationButton';

function HairshopDetailPage() {
  const location = useLocation();
  const style_name = location.state.style_name;
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

      <ReservationButton />
    </>
  );
}

export default HairshopDetailPage;
