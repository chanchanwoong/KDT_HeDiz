import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../api/AxiosAPI';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import MyReview from './MyReview';

function Mypage() {
  const { register, handleSubmit, reset } = useForm();
  const [info, setInfo] = useState({});
  const toast = useRef(null);

  // [GET] 미용실 정보 조회
  useEffect(() => {
    authAxios()
      .post(`/mypage/profile`, localStorage.getItem('cust_seq'), {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        console.log('Auth Response:', response.data);

        const serverData = {
          shop_register: response.data.shop_register,
          shop_name: response.data.shop_name,
          shop_address: response.data.shop_address,
          shop_phone: response.data.shop_phone,
          shop_start: response.data.shop_start,
          shop_end: response.data.shop_end,
          shop_tag: response.data.shop_tag,
          shop_intro: response.data.shop_intro,
        };

        setInfo(serverData);
        reset(serverData);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const onResetClick = () => {
    reset(info);
  };

  const onSubmit = (data) => {
    const formatShopRegular = data.shop_regular ? data.shop_regular.join(',') : '';
    const requestData = {
      ...data,
      shop_name: info.shop_name,
      shop_register: info.shop_register,
      shop_regular: formatShopRegular,
      shop_seq: localStorage.getItem('shop_seq'),
    };

    console.log('Auth Request:', requestData);

    authAxios()
      .put(`/mypage/profile`, requestData)
      .then((response) => {
        console.log('Auth Response:', response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  return (
    <>
      <span className="font-bold text-3xl">마이페이지</span>
      <div className="flex justify-content-between">
        <span>{localStorage.getItem('cust_name')}님 안녕하세요</span>
      </div>
      <Panel header="내 정보">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-column flex-wrap gap-4"
        >
          <div className="card flex flex-column gap-4">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-home mr-2"></i> 이름
              </span>
              <InputText
                placeholder="상호명"
                name="shop_register"
                defaultValue={info.shop_name}
                {...register('shop_name')}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-phone mr-2"></i> 아이디
              </span>
              <InputText
                name="shop_phone"
                placeholder="전화번호"
                {...register('shop_phone')}
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-hashtag mr-2"></i> 연락처
              </span>
              <InputText
                name="shop_tag"
                placeholder="태그"
                {...register('shop_tag')}
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-comment mr-2"></i> 성별
              </span>
              <InputText
                name="shop_intro"
                placeholder="미용실 소개글"
                {...register('shop_intro')}
              />
            </div>
          </div>

          <Toast ref={toast} />
          <div className="flex justify-content-end gap-2">
            <Button
              label="초기화"
              type="button"
              onClick={onResetClick}
              size="small"
              className="w-6rem"
              outlined
            />
            <Button
              label="수정하기"
              type="submit"
              size="small"
              className="w-6rem"
            />
          </div>
        </form>
      </Panel>
      <Divider />
      <div className="flex flex-column">
        <MyReview />
        <Link to="/mypage/list">내 리뷰</Link>
        <Link to="/mypage/list">내 예약 내역</Link>
      </div>
    </>
  );
}

export default Mypage;
