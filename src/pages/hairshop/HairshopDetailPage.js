import { Divider } from 'primereact/divider';
import { TabPanel, TabView } from 'primereact/tabview';
import HairshopPage from 'components/common/HairshopPage';
import StaffList from 'components/common/StaffList';
import HairstyleList from 'components/common/HairStyleList';
import ReviewList from 'components/common/ReviewList';

function HairshopDetailPage() {
  return (
    <>
      <HairshopPage />
      <Divider />
      <TabView>
        <TabPanel header='메뉴'>
          <HairstyleList />
        </TabPanel>
        <TabPanel header='디자이너'>
          <StaffList />
        </TabPanel>
        <TabPanel header='리뷰'>
          <ReviewList />
        </TabPanel>
      </TabView>
    </>
  );
}

export default HairshopDetailPage;
