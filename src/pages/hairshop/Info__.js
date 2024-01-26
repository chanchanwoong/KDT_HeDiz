import { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { authAxios } from 'api/AxiosAPI';
import DaumPostcode from 'react-daum-postcode';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Chips } from 'primereact/chips';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

function Info() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const toast = useRef(null);
  const [info, setInfo] = useState({});
  const [selectClosedDay, setSelectClosedDay] = useState([]);
  const [tag, setTag] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [checked, setChecked] = useState(false);

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

  const showToast = (severity, detail) => {
    toast.current.show({
      severity,
      summary: severity === 'success' ? 'Success' : 'Error',
      detail,
      life: 3000,
    });
  };

  const showSuccess = () => showToast('success', '미용실 정보 수정 성공');
  const showError = () => showToast('error', '미용실 정보 수정 실패');

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
        setTag(response.data.shop_tag ? response.data.shop_tag.split(',') : []);
        const serverData = {
          shop_register: response.data.shop_register,
          shop_name: response.data.shop_name,
          shop_address: response.data.shop_address,
          shop_phone: response.data.shop_phone,
          shop_start: response.data.shop_start,
          shop_end: response.data.shop_end,
          shop_intro: response.data.shop_intro,
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
      shop_tag: tag.join(','),
      shop_seq: localStorage.getItem('shop_seq'),
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
        <div className='flex flex-column gap-4'>
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
              className='w-2 text-sm'
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

          <div className='flex gap-3'>
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

            <div className='flex align-items-center mt-2 ml-4'>
              <Checkbox
                onChange={(e) => {
                  setChecked(e.checked);
                  if (e.checked) {
                    setSelectClosedDay(['0']);
                  }
                }}
                checked={checked}
              />
              <label className='ml-2'>휴무일 없음</label>
            </div>
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-hashtag mr-2'></i> 해시태그
            </span>

            {/* <Chips
              name='shop_tag'
              value={tag}
              onChange={(e) => {
                setInputTag(e.value);
                setInfo({ ...info, shop_tag: e.value });
              }}
              {...register('shop_tag')}
            /> */}
          </div>

          <div className='p-inputgroup flex-1'>
            <span className='p-inputgroup-addon'>
              <i className='pi pi-comment mr-2'></i> 미용실 소개글
            </span>
            <InputTextarea
              name='shop_intro'
              placeholder='미용실 소개글'
              rows={5}
              autoResize
              {...register('shop_intro')}
            />
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
