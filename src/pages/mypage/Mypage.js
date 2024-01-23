import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../api/AxiosAPI';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import MyReview from './MyReview';
import { InputMask } from 'primereact/inputmask';

function Mypage() {
  const { register, handleSubmit, reset } = useForm();
  const [info, setInfo] = useState({});
  const toast = useRef(null);

  // [GET] 미용실 정보 조회
  useEffect(() => {
    authAxios()
      .get(`/mypage/profile/${localStorage.getItem('cust_seq')}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        console.log('Auth Response:', response.data);
        let genderSelect = '';
        if (response.data.shop_gender === 1) {
          genderSelect = '남';
        } else {
          genderSelect = '여';
        }
        const serverData = {
          cust_name: response.data.cust_name,
          cust_id: response.data.cust_id,
          cust_phone: response.data.cust_phone,
          cust_gender: genderSelect,
        };

        setInfo(serverData);
        console.log(serverData);
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
    let genderSelect = '';
    if (info.cust_gender === '남') {
      genderSelect = 0;
    } else {
      genderSelect = 1;
    }
    const requestData = {
      ...data,
      cust_seq: localStorage.getItem('cust_seq'),
      cust_name: data.cust_name,
      cust_id: data.cust_id,
      cust_phone: data.cust_phone,
      cust_gender: genderSelect,
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
      <span className='font-bold text-3xl'>마이페이지</span>
      <div className='flex justify-content-between'>
        <span>{localStorage.getItem('cust_name')}님 안녕하세요</span>
      </div>
      <Panel header='내 정보'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-column flex-wrap gap-4'
        >
          <div className='card flex flex-column gap-4'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-home mr-2'></i> 이름
              </span>
              <InputText
                name='cust_name'
                defaultValue={info.cust_name}
                {...register('cust_name')}
                disabled
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-phone mr-2'></i> 아이디
              </span>
              <InputText
                name='cust_id'
                {...register('cust_id')}
                disabled
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-hashtag mr-2'></i> 연락처
              </span>
              <InputMask
                name='cust_phone'
                mask='999-9999-9999'
                maxLength={13}
                {...register('cust_phone')}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-comment mr-2'></i> 성별
              </span>
              <InputText
                name='cust_gender'
                {...register('cust_gender')}
                disabled
              />
            </div>
          </div>

          <Toast ref={toast} />
          <div className='flex justify-content-end gap-2'>
            <Button
              label='초기화'
              type='button'
              onClick={onResetClick}
              size='small'
              className='w-6rem'
              outlined
            />
            <Button
              label='수정하기'
              type='submit'
              size='small'
              className='w-6rem'
            />
          </div>
        </form>
      </Panel>
      <Divider />
      <div className='flex flex-column'>
        <MyReview />
        <Link to='/mypage/review'>내 리뷰</Link>
        <Link to='/mypage/list'>내 예약 내역</Link>
      </div>
    </>
  );
}

export default Mypage;
