import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authAxios } from 'api/AxiosAPI';
import { getReservationStat, getCustomerLevel } from 'utils/util';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';
import { formatHourMinute, formatDate } from 'utils/util';

function MyPage() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  // 나의 프로필
  const [info, setInfo] = useState([]);
  // 지난 예약
  const [reservationList, setReservationList] = useState([]);
  // 나의 리뷰
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    const custSeq = localStorage.getItem('cust_seq');
    if (!custSeq) {
      console.log('로그인 정보 없음');
      navigate('/auth/sign-in');
    } else {
      const profileRequest = authAxios().get(`/mypage/profile/${custSeq}`);
      const reservationRequest = authAxios().get(
        `mypage/reservation/${custSeq}`
      );
      const reviewRequest = authAxios().get(`mypage/review/${custSeq}`);

      axios
        .all([profileRequest, reservationRequest, reviewRequest])
        .then(
          axios.spread((profileRequest, reservationRequest, reviewRequest) => {
            let genderSelect = '';
            if (profileRequest.data.cust_gender === 0) {
              genderSelect = '남';
            } else {
              genderSelect = '여';
            }
            const infoData = {
              cust_name: profileRequest.data.cust_name,
              cust_id: profileRequest.data.cust_id,
              cust_phone: profileRequest.data.cust_phone,
              cust_level: profileRequest.data.cust_level,
              cust_gender: genderSelect,
            };

            setInfo(infoData);
            reset(infoData);
            setReservationList(reservationRequest.data);
            setReviewList(reviewRequest.data);

            console.log(profileRequest.data);
            console.log(reservationRequest.data);
            console.log(reviewRequest.data);
          })
        )
        .catch((error) => {
          console.error('Error in Axios.all:', error);
        });
    }
  }, []);

  // 로그아웃
  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  // 프로필 수정
  const onSubmit = (data) => {
    const requestData = {
      cust_seq: localStorage.getItem('cust_seq'),
      cust_phone: data.cust_phone,
    };

    authAxios()
      .put(`/mypage/profile`, requestData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setInfo((prevInfo) => ({
          ...prevInfo,
          cust_phone: data.cust_phone,
        }));
        showSuccessToast();
        setIsEditing(false);
      })
      .catch((error) => {
        showErrorToast();
        console.error('Auth Error:', error);
      });
  };

  const showSuccessToast = () => {
    toast.current.show({
      severity: 'success',
      summary: '프로필 수정 성공',
      detail: '프로필이 성공적으로 수정되었습니다.',
    });
  };
  const showErrorToast = () => {
    toast.current.show({
      severity: 'error',
      summary: '프로필 수정 실패',
      detail: '프로필을 수정하는 동안 문제가 발생했습니다. 다시 시도해주세요.',
    });
  };

  ///// 리뷰 삭제를 위한 axios 요청 (delete)
  const deleteReview = (product) => {
    authAxios()
      .delete(`mypage/review/${product.review_seq}`)
      .then((response) => {
        console.log('리뷰 삭제 성공');
        setReviewList((prevProducts) =>
          prevProducts.filter((p) => p.review_seq !== product.review_seq)
        );
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  return (
    <>
      {/* 수정 중이 아닐 때에만 프로필 수정 버튼 보이기 */}
      {!isEditing && (
        <section className='flex align-items-center justify-content-between'>
          <div className='flex flex-column'>
            <span className='font-semibold'>
              {info.cust_name}
              {/* <Badge
                className='font-light px-3 surface-400'
                value={getCustomerLevel(info.cust_level)}
              ></Badge> */}
            </span>
            <span className='text-sm text-color-secondary'>
              {getCustomerLevel(info.cust_level)}
            </span>
          </div>

          <div>
            <Button
              label='프로필 수정'
              type='button'
              size='small'
              onClick={() => setIsEditing(true)}
              className='mr-2'
            />
            <Button
              label='로그아웃'
              type='button'
              size='small'
              onClick={handleSignOut}
              outlined
            />
          </div>
        </section>
      )}
      {/* 수정 중일 때만 폼 보이기 */}
      {isEditing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-column flex-wrap gap-2'
        >
          <span className='text-color-secondary pl-1 font-semibold text-sm'>
            아이디
          </span>
          <InputText
            className='p-inputtext-sm mb-1'
            {...register('cust_id')}
            disabled
          />
          <span className='text-color-secondary pl-1 font-semibold text-sm'>
            이름
          </span>
          <InputText
            className='p-inputtext-sm mb-1'
            {...register('cust_name')}
            disabled
          />
          <span className='text-color-secondary pl-1 font-semibold text-sm'>
            전화번호
          </span>
          <InputMask
            name='cust_phone'
            mask='999-9999-9999'
            value={info.cust_phone}
            maxLength={13}
            {...register('cust_phone')}
            className='p-inputtext-sm mb-1'
          />
          <span className='text-color-secondary pl-1 font-semibold text-sm'>
            성별
          </span>
          <InputText
            className='p-inputtext-sm mb-4'
            {...register('cust_gender')}
            disabled
          />
          <div className='flex justify-content-end gap-2'>
            {' '}
            <Button
              label='수정하기'
              type='submit'
              size='small'
            />
            <Button
              label='취소'
              type='button'
              size='small'
              onClick={() => {
                setIsEditing(false);
              }}
              outlined
            />
          </div>
        </form>
      )}
      <section>
        <TabView className='mt-4'>
          <TabPanel header='지난 예약'>
            {reservationList.length === 0 ? (
              <p className='text-center text-sm text-color-secondary font-semibold my-8'>
                예약 내역이 없습니다
              </p>
            ) : (
              <>
                <Divider />
                {reservationList.map((item) => (
                  <div key={item.reserv_seq}>
                    <p className='font-semibold m-0 mb-4 flex justify-content-between'>
                      <span>
                        <i className='pi pi-calendar mr-2'></i>
                        {formatDate(item.reserv_date)}
                        <span> </span>
                        {formatHourMinute(item.reserv_time)}
                      </span>
                      <span className='text-500'>
                        {getReservationStat(item.reserv_stat)}
                      </span>
                    </p>
                    <p className='font-bold'>{item.shop_name}</p>
                    <p>{item.staff_nickname}</p>
                    <p>{item.style_name}</p>
                    <p>{item.reserv_request}</p>
                    <div className='flex justify-content-end gap-2'>
                      <Link
                        to='/mypage/write-review'
                        state={{
                          reserv_seq: item.reserv_seq,
                          reserv_stat: item.reserv_stat,
                          shop_seq: item.shop_seq,
                          shop_name: item.shop_name,
                        }}
                      >
                        {item.reserv_stat === 1 ? (
                          <Button>리뷰 등록</Button>
                        ) : null}
                      </Link>
                    </div>
                    <Divider />
                  </div>
                ))}
              </>
            )}
          </TabPanel>
          <TabPanel header='나의 리뷰'>
            {reviewList.length === 0 ? (
              <p className='text-center text-sm text-color-secondary font-semibold my-8'>
                리뷰 내역이 없습니다
              </p>
            ) : (
              <>
                <Divider />
                {reviewList.map((item) => (
                  <div key={item.review_seq}>
                    <p className='font-semibold m-0 mb-4 flex justify-content-between'>
                      <span>
                        <i className='pi pi-calendar mr-2'></i>
                        작성일자 {formatDate(item.review_date)}
                        <span> </span>
                        {formatHourMinute(item.review_time)}
                      </span>
                      <span className='text-500'>{item.shop_name}</span>
                    </p>
                    <p className='font-bold'>{item.shop_name}</p>
                    <p>{item.staff_nickname}</p>
                    <p>{item.style_name}</p>
                    <Rating
                      value={item.review_score}
                      readOnly
                      cancel={false}
                    ></Rating>
                    <p>{item.review_content}</p>
                    <div className='flex justify-content-end gap-2'>
                      <Button onClick={() => deleteReview(item)}>
                        리뷰 삭제
                      </Button>
                    </div>
                    <Divider />
                  </div>
                ))}
              </>
            )}
          </TabPanel>
        </TabView>
      </section>
      <Toast
        ref={toast}
        position='bottom-center'
      />
    </>
  );
}

export default MyPage;
