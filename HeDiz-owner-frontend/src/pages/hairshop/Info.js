import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authAxios } from 'api/AxiosAPI';
import DaumPostcode from 'react-daum-postcode';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

function Info() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const toast = useRef(null);
  const [info, setInfo] = useState({});
  const [selectClosedDay, setSelectClosedDay] = useState([]);
  const [checked, setChecked] = useState(false);
  const [sendImgs, setSendImgs] = useState([]);

  const closedDay = [
    { label: '휴무일 없음', value: '0' },
    { label: '일요일', value: '1' },
    { label: '월요일', value: '2' },
    { label: '화요일', value: '3' },
    { label: '수요일', value: '4' },
    { label: '목요일', value: '5' },
    { label: '금요일', value: '6' },
    { label: '토요일', value: '7' },
  ];

  const convertArrayToString = (array) => {
    return array.join(',');
  };

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const handleAddressSelect = (data) => {
    const { address } = data;
    setSelectedAddress(address);
    setValue('shop_address', address);
    setAddressModalOpen(false);
  };

  const onResetClick = () => {
    reset(info);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: '미용실 정보 수정 성공',
      life: 3000,
    });
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: '미용실 정보 수정 실패',
      life: 3000,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setSendImgs();
      alert('JPG, JPEG, PNG, GIF 형식의 이미지 파일만 허용됩니다.');
      return;
    }
    let reader = new FileReader();
    reader.onload = () => {
      setSendImgs(reader.result);
      setInfo({ ...info, shop_image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    reset({
      shop_regular: selectClosedDay,
    });
  }, [selectClosedDay]);

  // [GET] 미용실 정보 조회
  useEffect(() => {
    authAxios()
      .get(`/hairshop/info/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setSelectClosedDay(
          response.data.shop_regular
            ? response.data.shop_regular.split(',')
            : []
        );

        const serverData = {
          shop_register: response.data.shop_register,
          shop_name: response.data.shop_name,
          shop_address: response.data.shop_address,
          shop_phone: response.data.shop_phone,
          shop_start: response.data.shop_start,
          shop_end: response.data.shop_end,
          shop_tag: response.data.shop_tag,
          shop_intro: response.data.shop_intro,
          shop_image: response.data.shop_image,
        };

        setInfo(serverData);
        reset(serverData);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  // [PUT] 미용실 정보 수정
  const onSubmit = (data) => {
    const formatShopRegular = data.shop_regular
      ? data.shop_regular.join(',')
      : '';
    const requestData = {
      ...data,
      shop_name: info.shop_name,
      shop_register: info.shop_register,
      shop_regular: formatShopRegular,
      shop_seq: localStorage.getItem('shop_seq'),
      shop_image: info.shop_image,
    };

    console.log('Auth Request:', requestData);

    authAxios()
      .put(`/hairshop/info`, requestData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        showSuccess();
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        showError();
      });
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        미용실 정보
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-column gap-2'>
          <div className='flex gap-2'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-home mr-2'></i> 상호명
              </span>
              <InputText
                placeholder='상호명'
                name='shop_register'
                defaultValue={info.shop_name}
                {...register('shop_name')}
                disabled
              />
            </div>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user mr-2'></i> 사업자 등록번호
              </span>
              <InputText
                placeholder='사업자 등록번호'
                name='shop_register'
                defaultValue={info.shop_register}
                {...register('shop_register')}
                disabled
              />
            </div>
          </div>

          <div className='flex gap-2'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-clock mr-2'></i> 영업 시작 시간
              </span>
              <InputText
                name='shop_start'
                placeholder='영업 시작 시간'
                {...register('shop_start')}
              />
            </div>

            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-clock mr-2'></i> 영업 종료 시간
              </span>
              <InputText
                name='shop_end'
                placeholder='영업 종료 시간'
                {...register('shop_end')}
              />
            </div>
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-calendar-minus mr-2'></i> 정기 휴무일
            </span>

            <MultiSelect
              name='shop_regular'
              value={checked ? ['0'] : selectClosedDay}
              onChange={(e) => {
                setSelectClosedDay(e.value);
                const selectedDaysString = convertArrayToString(e.value);
                setInfo({ ...info, shop_regular: selectedDaysString });
              }}
              options={closedDay}
              optionLabel='label'
              optionValue='value'
              placeholder='정기 휴무일'
              className={`w-full md:w-20rem ${checked ? 'p-disabled' : ''}`}
              disabled={checked}
            />

            <div className='flex align-items-center ml-3'>
              <Checkbox
                onChange={(e) => {
                  setChecked(e.checked);
                  if (e.checked) {
                    setSelectClosedDay(['0']);
                  }
                }}
                checked={checked}
              />
              <label
                htmlFor='ingredient1'
                className='ml-2'
              >
                휴무일 없음
              </label>
            </div>
          </div>
          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-map-marker mr-2'></i> 주소
            </span>
            <InputText
              name='shop_address'
              placeholder='주소'
              {...register('shop_address')}
            />
            <Button
              type='button'
              label='주소 검색'
              className='text-sm'
              style={{ width: '150px' }}
              onClick={() => setAddressModalOpen(true)}
            />
          </div>
          {isAddressModalOpen && (
            <DaumPostcode
              onComplete={handleAddressSelect}
              autoClose={false}
              animation
            />
          )}
          <div className='flex gap-3'>
            <div className='p-inputgroup flex-1'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-phone mr-2'></i> 전화번호
              </span>
              <InputText
                name='shop_phone'
                placeholder='전화번호'
                {...register('shop_phone')}
              />
            </div>
          </div>
          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-hashtag mr-2'></i> 해시태그
            </span>
            <InputText
              name='shop_tag'
              placeholder='태그'
              {...register('shop_tag')}
            />
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-comment mr-2'></i> 미용실 소개글
            </span>
            <InputTextarea
              name='shop_intro'
              placeholder='미용실 소개글'
              rows={2}
              autoResize
              {...register('shop_intro')}
            />
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-image mr-2'></i> 사진 업로드
            </span>

            <div className='w-full p-inputtext flex justify-content-between align-items-end'>
              <input
                type='file'
                multiple
                style={{ display: 'none' }}
                id='file'
                name='shop_image'
                accept='image/*'
                onChange={handleImageUpload}
              />
              {info.shop_image && (
                <img
                  src={info.shop_image}
                  className='block m-auto w-3 shadow-2 border-round'
                />
              )}
              <label
                htmlFor='file'
                className='p-button p-component justify-content-center text-small font-semibold p-button-sm w-1'
              >
                선택
              </label>
            </div>
          </div>
        </div>

        <Toast ref={toast} />
        <div className='flex justify-content-end gap-4 mt-6'>
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
    </div>
  );
}

export default Info;
