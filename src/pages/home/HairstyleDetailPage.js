import { Divider } from 'primereact/divider';
import { TabPanel, TabView } from 'primereact/tabview';
import ReviewList from '../../components/common/ReviewList';
import HairstylePage from '../../components/common/HairstylePage';
import { useLocation } from 'react-router-dom';

function HairshopDetailPage() {
  const location = useLocation();
  const style_name = location.state.style_name;
  console.log('style이름', style_name);
  return (
    <>
      <HairstylePage />
      <Divider />
      <TabView>
        <TabPanel header='정보'></TabPanel>
        <TabPanel header='리뷰'>
          <ReviewList style_name={style_name} />
        </TabPanel>
      </TabView>
    </>
  );
}

export default HairshopDetailPage;
