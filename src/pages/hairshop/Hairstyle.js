import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { Controller, useForm } from 'react-hook-form';
import { formatTimeTaken, formatNumberWithCommas } from 'service/Utils';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

export default function Hairstyle() {
  const shop_seq = localStorage.getItem('shop_seq');
  const defaultValues = {
    shop_seq: shop_seq,
    style_seq: 0,
    style_name: '',
    style_gender: '',
    style_time: '',
    style_price: null,
    style_intro: '',
    style_image: null,
    cate_seq: 0,
    cate_name: '',
  };

  // 카테고리, 카테고리 옵션 정렬
  const categoryOptions = [
    { cate_name: '커트', cate_seq: 1 },
    { cate_name: '펌', cate_seq: 2 },
    { cate_name: '염색', cate_seq: 3 },
    { cate_name: '클리닉', cate_seq: 4 },
    { cate_name: '스타일링', cate_seq: 5 },
  ];

  const categoryTemplate = (data) => {
    return <p className='font-bold text-center'>{data.cate_name}</p>;
  };

  const accept = (msg) => {
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: msg,
      life: 3000,
    });
  };

  const reject = (msg) => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: msg,
      life: 3000,
    });
  };

  const onCancelClick = () => {
    reset(defaultValues);
    setVisible(false);
  };

  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm();

  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hairstyles, setHairstyles] = useState(null);
  const [product, setProduct] = useState(defaultValues);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [sendImgs, setSendImgs] = useState([]);
  const dt = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // 헤어스타일 불러오기 및 업데이트
  const loadData = () => {
    authAxios()
      .get(`/hairshop/hairstyle/${shop_seq}`)
      .then((response) => {
        setHairstyles(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  // 헤어스타일 추가
  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      shop_seq,
    };

    authAxios()
      .post(`/hairshop/hairstyle`, requestData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        accept('헤어스타일을 추가했습니다. ');
        reset(defaultValues);
        setVisible(false);
        loadData();
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        reject('실패했습니다. ');
      });
  };

  // 헤어스타일 수정
  const onRowEditComplete = (e) => {
    let _hairstyle = [...hairstyles];
    let { newData, index } = e;
    _hairstyle[index] = newData;

    authAxios()
      .put(`/hairshop/hairstyle`, newData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        accept('헤어스타일 정보를 수정했습니다. ');
        reset(defaultValues);
        setVisible(false);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        reject('실패했습니다. ');
      });
    setHairstyles(_hairstyle);
  };
  const textEditor = (options) => {
    return (
      <InputText
        type='text'
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  // 헤어스타일 삭제
  const onRowDeleteComplete = (e, rowData) => {
    confirmPopup({
      target: e.currentTarget,
      message: '정말 삭제하시겠습니까?',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: () => {
        authAxios()
          .delete(`/hairshop/hairstyle/${rowData.style_seq}`)
          .then((response) => {
            console.log('Delete Response:', response.data);
            accept('삭제를 완료했습니다. ');
            loadData();
          })
          .catch((error) => {
            console.error('Delete Error:', error);
            reject('실패했습니다. ');
          });
      },
    });
  };
  const deleteTemplate = (rowData) => {
    return (
      <Button
        onClick={(e) => onRowDeleteComplete(e, rowData)}
        icon='pi pi-trash'
        rounded
        text
        severity='secondary'
        className='p-button-danger'
      />
    );
  };

  // 이미지 업로드 코드
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setSendImgs();
      alert('JPG 사진 파일만 가능합니다.');
      return;
    }
    let reader = new FileReader();
    reader.onload = () => {
      setSendImgs(reader.result);
      setProduct({ ...product, style_image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Datatable에서 사용하는 템플릿
  // 이미지
  const imageBodyTemplate = (rowData) => {
    const imageData = rowData.style_image;
    return (
      <img
        src={imageData}
        className='shadow-2 border-round'
        style={{ width: '100px' }}
      />
    );
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        <span>헤어스타일</span>
        <div>
          <span className='p-input-icon-left mr-4'>
            <i className='pi pi-search' />
            <InputText
              type='search'
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder='검색'
              className='p-inputtext-sm'
            />
          </span>
          <Button
            label={`헤어스타일 추가 (총 ${
              hairstyles ? hairstyles.length : 0
            } 건)`}
            icon='pi pi-plus'
            size='small'
            onClick={() => setVisible(true)}
          />
        </div>
      </h2>

      <DataTable
        ref={dt}
        value={hairstyles}
        dataKey='style_seq'
        showGridlines
        scrollable
        scrollHeight='800px'
        globalFilter={globalFilter}
        size='small'
        // 카테고리 그룹화
        rowGroupMode='rowspan'
        groupRowsBy='cate_name'
        // 수정 모드
        editMode='row'
        onRowEditComplete={onRowEditComplete}
      >
        <Column
          field='cate_name'
          header='카테고리'
          sortable
          body={categoryTemplate}
        ></Column>

        <Column
          field='style_name'
          header='헤어스타일 명'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='style_price'
          header='가격'
          sortable
          editor={(options) => textEditor(options)}
          body={(rowData) => (
            <span>{formatNumberWithCommas(rowData.style_price)} 원</span>
          )}
          className='text-right pr-3'
        ></Column>

        <Column
          field='style_time'
          header='소요시간'
          sortable
          editor={(options) => textEditor(options)}
          body={(rowData) => <span>{formatTimeTaken(rowData.style_time)}</span>}
          className='pl-3'
        ></Column>

        <Column
          field='style_intro'
          header='소개'
          sortable
          editor={(options) => textEditor(options)}
          className='pl-3 w-4 white-space-normal'
        ></Column>

        <Column
          field='style_gender'
          header='시술대상'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='style_image'
          header='이미지'
          className='text-center'
          body={imageBodyTemplate}
        ></Column>

        <Column
          header='수정'
          rowEditor={true}
          headerStyle={{ minWidth: '6rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>

        <Column
          header='삭제'
          exportable={false}
          className='text-center'
          headerStyle={{ minWidth: '6rem' }}
          body={deleteTemplate}
        ></Column>
      </DataTable>

      <Toast ref={toast} />
      <ConfirmPopup />

      {/* 헤어스타일 추가 */}
      <Dialog
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='헤어스타일 추가'
        className='p-fluid w-4'
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-column flex-wrap gap-4 mt-4'
        >
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>카테고리</label>
            <Controller
              control={control}
              name='cate_seq'
              render={({ field }) => (
                <Dropdown
                  placeholder='카테고리'
                  {...field}
                  value={selectedCategory}
                  onChange={(e) => {
                    const selectedOption = categoryOptions.find(
                      (option) => option.cate_seq === e.value
                    );
                    setSelectedCategory(e.value);
                    field.onChange(e.value);
                  }}
                  options={categoryOptions}
                  optionLabel='cate_name'
                  optionValue='cate_seq'
                  required
                />
              )}
              rules={{ required: '카테고리를 선택하세요.' }}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>헤어스타일 명</label>
            <InputText
              placeholder='헤어스타일 명'
              name='style_name'
              {...register('style_name', { required: true })}
            />
          </div>

          <div className='flex-auto'>
            <label className='font-bold block mb-2'>가격</label>
            <InputText
              placeholder='가격'
              keyfilter='int'
              name='style_price'
              {...register('style_price', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>소요시간</label>
            <InputText
              placeholder='소요시간'
              name='style_time'
              {...register('style_time', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>시술대상</label>
            <InputText
              placeholder='시술대상'
              name='style_gender'
              {...register('style_gender', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>스타일 소개</label>
            <InputTextarea
              autoResize
              rows={3}
              placeholder='소개'
              name='style_intro'
              {...register('style_intro', { required: true })}
            />
          </div>

          <div>
            <label className='font-bold block mb-2'>이미지 업로드</label>
            <input
              type='file'
              multiple
              style={{ display: 'none' }}
              name='style_image'
              accept='.jpg'
              onChange={handleImageUpload}
            />
          </div>
          {product.style_image && (
            <img
              src={product.style_image}
              className='product-staff block m-auto pb-3 w-4'
            />
          )}

          <div className='flex justify-content-end gap-2'>
            <Button
              label='취소'
              type='button'
              onClick={onCancelClick}
              size='small'
              className='w-6rem'
              outlined
            />
            <Button
              label='추가'
              type='button'
              onClick={handleSubmit(onSubmit)}
              size='small'
              className='w-6rem'
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
