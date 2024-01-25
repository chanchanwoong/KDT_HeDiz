import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { useForm } from 'react-hook-form';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

export default function staff() {
  const shop_seq = localStorage.getItem('shop_seq');
  let defaultValues = {
    shop_seq: shop_seq,
    staff_seq: 0,
    staff_nickname: '',
    staff_role: '',
    staff_phone: '',
    staff_name: null,
    staff_intro: '',
    staff_image: null,
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
  const [staffs, setStaffs] = useState(null);
  const [product, setProduct] = useState(defaultValues);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [sendImgs, setSendImgs] = useState([]);
  const dt = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // 직원 불러오기 및 업데이트
  const loadData = () => {
    authAxios()
      .get(`/hairshop/staff/${shop_seq}`)
      .then((response) => {
        setStaffs(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  // 직원 등록
  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      shop_seq,
    };

    authAxios()
      .post(`/hairshop/staff`, requestData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        accept('직원을 등록했습니다. ');
        reset(defaultValues);
        setVisible(false);
        loadData();
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        reject('실패했습니다. ');
      });
  };

  // 직원 수정
  const onRowEditComplete = (e) => {
    let _staffs = [...staffs];
    let { newData, index } = e;
    _staffs[index] = newData;

    authAxios()
      .put(`/hairshop/staff`, newData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        accept('직원 정보를 수정했습니다. ');
        reset(defaultValues);
        setVisible(false);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        reject('실패했습니다. ');
      });
    setStaffs(_staffs);
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

  // 직원 삭제
  const deleteHairstyle = (e, rowData) => {
    confirmPopup({
      target: e.currentTarget,
      message: '정말 삭제하시겠습니까?',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: () => {
        authAxios()
          .delete(`/hairshop/staff/${rowData.staff_seq}`)
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
      <>
        <Button
          onClick={(e) => deleteHairstyle(e, rowData)}
          icon='pi pi-trash'
          rounded
          text
          severity='secondary'
          className='p-button-danger'
        />
      </>
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
      alert('JPG 사진 파일만 가능합니다.');
      return;
    }

    let reader = new FileReader();
    reader.onload = () => {
      setSendImgs(reader.result);
      setProduct({ ...product, staff_image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const imageBodyTemplate = (rowData) => {
    const imageData = rowData.staff_image;
    return (
      <img
        src={imageData}
        className='shadow-2 border-round'
        style={{ width: '64px' }}
      />
    );
  };

  const onUpload = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
    });
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        <span>직원 관리</span>
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
            label='직원 등록'
            icon='pi pi-plus'
            size='small'
            onClick={() => setVisible(true)}
          />
        </div>
      </h2>
      <DataTable
        ref={dt}
        value={staffs}
        dataKey='staff_seq'
        showGridlines
        paginator
        rows={10}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        currentPageReportTemplate='총 {totalRecords}명의 직원이 검색되었습니다. '
        globalFilter={globalFilter}
        size='small'
        // 수정 모드
        editMode='row'
        onRowEditComplete={onRowEditComplete}
      >
        <Column
          field='staff_role'
          header='직급'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='staff_nickname'
          header='직원 닉네임'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='staff_intro'
          header='직원 소개'
          sortable
          editor={(options) => textEditor(options)}
          className='pl-3'
        ></Column>

        <Column
          field='staff_name'
          header='직원 이름'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='staff_phone'
          header='직원 전화번호'
          sortable
          editor={(options) => textEditor(options)}
          className='text-center'
        ></Column>

        <Column
          field='staff_image'
          header='이미지'
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

      <Dialog
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='직원 등록'
        className='p-fluid w-4'
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-column flex-wrap gap-4 mt-4'
        >
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>직원 이름</label>
            <InputText
              placeholder='직원 이름'
              name='staff_name'
              {...register('staff_name', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>직원 이름</label>
            <InputText
              placeholder='직원 닉네임'
              name='staff_nickname'
              {...register('staff_nickname', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>직원 직급</label>
            <InputText
              placeholder='직원 직급'
              name='staff_role'
              {...register('staff_role', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>직원 전화번호</label>
            <InputText
              placeholder='직원 전화번호'
              name='staff_phone'
              {...register('staff_phone', { required: true })}
            />
          </div>
          <div className='flex-auto'>
            <label className='font-bold block mb-2'>직원 소개</label>
            <InputTextarea
              autoResize
              rows={5}
              placeholder='직원 소개'
              name='staff_intro'
              {...register('staff_intro', { required: true })}
            />
          </div>
          {product.staff_image && (
            <img
              src={product.staff_image}
              className='product-staff block m-auto pb-3  w-4'
            />
          )}

          <div>
            <input
              type='file'
              multiple
              style={{ display: 'none' }}
              id='staff_image'
              name='staff_image'
              accept='.jpg'
              onChange={handleImageUpload}
            />
            <label
              className='btn btn-secondary border-0 bg_grey text-bold'
              htmlFor='staff_image'
            >
              사진 추가
            </label>
          </div>

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
              label='등록'
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
