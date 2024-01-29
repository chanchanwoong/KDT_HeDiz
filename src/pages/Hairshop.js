import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { authAxios } from 'api/AxiosAPI';
import KakaoMap from 'api/KakaoMapAPI';
import { formatDecimal, formatNumberWithCommas, getDayName } from 'utils/util';
import HairstyleList from 'components/HairstyleList';
import ReviewList from 'components/ReviewList';
import { TabView, TabPanel } from 'primereact/tabview';
import { Image } from 'primereact/image';
import { Rating } from 'primereact/rating';
import { Sidebar } from 'primereact/sidebar';

function Hairshop() {
  const { shop_seq } = useParams();
  // shop_seq에 대한 미용실 정보
  const [hairshopInfo, setHairshopInfo] = useState([]);
  // shop_seq에 대한 미용실에서 제공하는 헤어스타일 정보
  const [hairstyleList, setHairstyleList] = useState([]);
  // shop_seq에 대한 미용실의 디자이너(직원) 정보
  const [staffList, setStaffList] = useState([]);
  // shop_seq에 대한 미용실의 리뷰 정보
  const [reviewList, setReviewList] = useState([]);
  // 미용실 위치
  const [kakaomapVisible, setKakaomapVisible] = useState(false);
  const [hairshopLocation, setHairshopLocation] = useState(null);
  const mapHeader = (
    <div className='flex align-items-center gap-2'>
      <span className='font-bold'>{hairshopInfo.shop_address}</span>
    </div>
  );

  useEffect(() => {
    const hairshopRequest = authAxios().get(`/hairshop/${shop_seq}`);
    const hairstyleRequest = authAxios().get(`/hairshop/${shop_seq}/hairstyle`);
    const staffRequest = authAxios().get(`/hairshop/${shop_seq}/staff`);
    const reviewRequest = authAxios().get(`/hairshop/${shop_seq}/review`);

    axios
      .all([hairshopRequest, hairstyleRequest, staffRequest, reviewRequest])
      .then(
        axios.spread(
          (hairshopRequest, hairstyleRequest, staffRequest, reviewRequest) => {
            setHairshopInfo(hairshopRequest.data);
            setHairstyleList(hairstyleRequest.data);
            setStaffList(staffRequest.data);
            setReviewList(reviewRequest.data);
            setHairshopLocation(hairshopRequest.data.shop_address);

            console.log(hairstyleRequest.data);
          }
        )
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, []);

  return (
    <>
      {/* 미용실 정보 */}
      <section>
        {/* <img
        src={hairshopInfo.shop_image}
        alt={hairshopInfo.shop_name}
      /> */}
        <Image
          src='https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg'
          alt='Image'
          width='100%'
          height='200px'
        />

        <div className='mt-2'>
          <p className='text-sm font-semibold text-500 m-0'>
            {hairshopInfo.shop_address}
          </p>
          <p className='font-semibold text-xl my-1'>{hairshopInfo.shop_name}</p>
          <div className='flex align-items-center gap-2 m-0'>
            <Rating
              value={hairshopInfo.avg_review_score}
              readOnly
              cancel={false}
            />
            <span className='font-semibold'>
              {formatDecimal(hairshopInfo.avg_review_score)}
              <span className='text-500 text-sm ml-1'>
                (총 {formatNumberWithCommas(hairshopInfo.count_review)}개 리뷰)
              </span>
            </span>
          </div>
          <p className='mb-5'>{hairshopInfo.shop_intro}</p>

          <div className='flex flex-column gap-2 my-4'>
            <span>
              <i className='pi pi-calendar-times mr-2'></i>
              {getDayName(hairshopInfo.shop_regular)} 휴무
            </span>
            <span>
              <i className='pi pi-clock mr-2'></i>
              {hairshopInfo.shop_start} - {hairshopInfo.shop_end}
            </span>
            <span>
              <i className='pi pi-hashtag mr-2'></i>
              {hairshopInfo.shop_tag}
            </span>
          </div>
          <ul className='list__info'>
            <li>
              <i className='pi pi-phone mr-2'></i>전화
            </li>
            <li
              onClick={() => {
                setKakaomapVisible(true);
              }}
            >
              <i className='pi pi-map-marker mr-2'></i>
              위치
            </li>
          </ul>

          <Sidebar
            header={mapHeader}
            visible={kakaomapVisible}
            onHide={() => setKakaomapVisible(false)}
            position='bottom'
          >
            <KakaoMap hairshopLocation={hairshopLocation} />
          </Sidebar>
        </div>
      </section>

      {/* 사이드 메뉴 */}
      {/* 메뉴 */}
      <TabView>
        <TabPanel header='메뉴'>
          {hairstyleList.length === 0 ? (
            <p className='text-center text-sm text-color-secondary font-semibold my-8'>
              등록된 메뉴가 없습니다
            </p>
          ) : (
            <HairstyleList
              hairstyleList={hairstyleList}
              shopSeq={shop_seq}
            />
          )}
        </TabPanel>
        {/* 디자이너 */}
        <TabPanel header='디자이너'>
          {staffList.length === 0 ? (
            <p className='text-center text-sm text-color-secondary font-semibold my-8'>
              등록된 디자이너가 없습니다
            </p>
          ) : (
            <>
              {staffList.map((staff) => (
                <div
                  key={staff.staff_seq}
                  className='flex align-items-center justify-content-between gap-4 my-4'
                >
                  {/* <img
                src={staff.staff_image}
                alt={staff.staff_nickname}
              /> */}
                  <Image
                    src='https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                    alt='Image'
                    className='img__staff'
                  />
                  {/* <h3>{staff.staff_nickname}</h3> */}
                  <div className='flex-grow-1'>
                    <p className='mb-2'>
                      <b className='font-base'>{staff.staff_nickname}</b>
                      {staff.staff_role}
                    </p>
                    <p className='text-color-secondary text-sm mt-0'>
                      {staff.staff_intro}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </TabPanel>

        {/* 리뷰 */}
        <TabPanel
          header={`리뷰 (${formatNumberWithCommas(hairshopInfo.count_review)})`}
        >
          {reviewList.length === 0 ? (
            <p className='text-center text-sm text-color-secondary font-semibold my-8'>
              등록된 리뷰가 없습니다
            </p>
          ) : (
            <ReviewList reviewList={reviewList} />
          )}
        </TabPanel>
      </TabView>
    </>
  );
}

export default Hairshop;
