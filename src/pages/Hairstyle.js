import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { authAxios } from 'api/AxiosAPI';
import { formatNumberWithCommas } from 'utils/util';
import { Image } from 'primereact/image';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';

function Hairstyle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shop_seq, style_seq } = useParams();
  const [hairstyle, setHairstyle] = useState([]);
  const [review, setReview] = useState([]);

  useEffect(() => {
    const hairstyleReqeust = authAxios().get(
      `/hairshop/${shop_seq}/hairstyle/${style_seq}`
    );
    const reviewRequest = authAxios().get(`/hairshop/${shop_seq}/review`);

    axios
      .all([hairstyleReqeust, reviewRequest])
      .then(
        axios.spread((hairstyleReqeust, reviewRequest) => {
          setHairstyle(hairstyleReqeust.data);
          console.log(hairstyleReqeust.data);
          const style_name = hairstyleReqeust.data.style_name;

          if (style_name !== undefined) {
            const filteredReviews = reviewRequest.data.filter(
              (review) => review.style_name === style_name
            );
            setReview(filteredReviews);
          } else {
            console.log(reviewRequest.data);
            setReview(reviewRequest.data);
          }
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, []);

  // 로그인 확인 후 예약 페이지 이동
  const handleReservation = () => {
    const custSeq = localStorage.getItem('cust_seq');

    if (!custSeq) {
      console.log('로그인 정보 없음');
      localStorage.setItem('returnUrl', location.pathname);
      navigate('/auth/sign-in');
      return;
    }
    localStorage.removeItem('returnUrl');
    navigate(`/schedule?hairshop=${shop_seq}&hairstyle=${style_seq}`);
  };

  return (
    <>
      <section className='mt-4 mb-6'>
        {/* <img
        src={hairstyle.style_image}
        alt={hairstyle.style_name}
      /> */}
        <Image
          src='https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg'
          alt='Image'
        />
        <p className='flex align-items-center justify-content-between font-bold text-xl'>
          <span>{hairstyle.style_name}</span>
          <span className='text-color-secondary'>{hairstyle.shop_name}</span>
        </p>
        <p className='font-semibold text-2xl mb-1'>
          <span className='pr-2'>
            {formatNumberWithCommas(hairstyle.style_price)}
          </span>
          {/* <span>({formatTime(hairstyle.style_time)})</span> */}
        </p>
        <p className='text-color-secondary mt-0 mb-4'>
          {hairstyle.style_intro}
        </p>
        <p>
          <i className='pi pi-stopwatch mr-2'></i>
          <b>소요시간</b>
          {hairstyle.style_time}
        </p>
        <p>
          <i className='pi pi-user mr-2'></i>
          <b>대상고객</b>
          {hairstyle.style_gender}
        </p>
        <p>
          <i className='pi pi-phone mr-2'></i>
          <b>카테고리</b>
          {hairstyle.cate_name}
        </p>
      </section>
      <TabView>
        <TabPanel header='리뷰'>
          {review.length === 0 ? (
            <p className='text-center text-sm text-color-secondary font-semibold my-8'>
              등록된 리뷰가 없습니다
            </p>
          ) : (
            <>
              {review.map((review) => (
                <div key={review.review_seq}>
                  <article className='flex align-items-start justify-content-between gap-4 my-4'>
                    {/* <img
                  src={hairstyle.style_image}
                  alt={hairstyle.style_name}
                /> */}
                    <Image
                      src='https://primefaces.org/cdn/primereact/images/galleria/galleria8.jpg'
                      alt='Image'
                      className='w-4 flex-none'
                    />
                    <div className='flex-grow-1'>
                      <div className='flex align-items-start justify-content-between my-2'>
                        <div className='flex flex-column'>
                          <p className='font-bold mt-0 mb-1'>
                            {review.style_name}
                          </p>
                          <p className='m-0'>{review.staff_nickname}</p>
                        </div>
                        <div className='flex flex-column align-items-end'>
                          <Rating
                            value={review.review_score}
                            readOnly
                            cancel={false}
                            className='mb-2'
                          />
                          <p className='text-color-secondary text-sm m-0 mb-2'>
                            <span>{review.review_date} . </span>
                            <span>{review.cust_id}</span>
                          </p>
                        </div>
                      </div>
                      <p className='mt-0 mb-2 text-sm'>
                        {review.review_content}
                      </p>
                      <p className='mb-2 text-sm'>
                        <i
                          className='pi pi-heart mr-1'
                          style={{ position: 'relative', top: '2px' }}
                        ></i>
                        {review.review_reply}
                      </p>
                    </div>
                  </article>
                  <Divider />
                </div>
              ))}
            </>
          )}
        </TabPanel>
        <TabPanel header='예약 취소 및 환불 규정'>
          <p className='font-bold'>예약 취소/환불</p>
          <p className='mb-4'>
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently.
          </p>
          <p className='font-bold'>예약 변경</p>
          <p className='mb-4'>
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently.
          </p>
          <p className='font-bold'>취소/환불 정보</p>
          <p className='mb-4'>
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently.
          </p>
        </TabPanel>
      </TabView>
      <Button
        label='예약하기'
        className='btn__submit'
        onClick={handleReservation}
      />
    </>
  );
}

export default Hairstyle;
