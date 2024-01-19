import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import callAxios from 'service/CallAxios';

export default function staff() {
  const shop_seq = localStorage.getItem('shop_seq');
  let emptyProduct = {
    shop_seq: shop_seq,
    staff_seq: 0,
    staff_nickname: '',
    staff_role: '',
    staff_phone: '',
    staff_name: null,
    staff_intro: '',
    staff_image: null,
    cate_seq: 0,
    cate_name: '',
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [btnRefreshUser, setBtnRefreshUser] = useState(false);
  const [inferResult, setInferResult] = useState([]);
  const [sendImgs, setSendImgs] = useState([]);
  const dt = useRef(null);
  const toast = useRef(null);
  const token = localStorage.getItem('jwtauthtoken');

  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/staff/' + shop_seq, {
        headers: { jwtauthtoken: token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hshop_seqeDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hshop_seqeDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

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
    };

    reader.readAsDataURL(file);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (product.staff_nickname.trim()) {
      let _products = [...products];
      console.log(product);
      console.log(product.staff_image);
      product.staff_image = sendImgs;
      console.log(product.staff_image);
      let _product = { ...product };
      console.log(_product);
      try {
        if (product.staff_seq) {
          const index = findIndexBystaff_seq(product.staff_seq);

          _products[index] = _product;
          await axios.put(`http://localhost:8080/hairshop/staff/`, _product, {
            headers: { jwtauthtoken: token },
          });

          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Updated',
            life: 3000,
          });
        } else {
          _product.staff_seq = _products.length + 1;
          _product.staff_image = 'product-placeholder.svg'; // Use 'staff_image' instead of 'staff_'
          _products.push(_product);
          await axios.post('http://localhost:8080/hairshop/staff/', _product, {
            headers: { jwtauthtoken: token },
          });
          console.log(_product);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
          });
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
      } catch (error) {
        console.error('Error saving product:', error);
        // Handle error as needed
      }
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter(
      (val) => val.staff_seq !== product.staff_seq
    );

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
    callAxios({
      method: 'delete',
      url: 'http://localhost:8080/hairshop/staff/' + product.staff_seq,
    });
  };

  const findIndexBystaff_seq = (staff_seq) => {
    return products.findIndex((product) => product.staff_seq === staff_seq);
  };

  const onInputChange = (e, staff_nickname) => {
    const val = (e.target && e.target.value) || '';
    // Use spread operator for immutability
    setProduct({ ...product, [staff_nickname]: val });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button
          label='New'
          icon='pi pi-plus'
          severity='success'
          onClick={openNew}
        />
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    // Assuming rowData.staff_image contains base64 encoded image data
    const imageData = rowData.staff_image;

    return (
      <img
        src={imageData} // Set the correct data URL format
        className='shadow-2 border-round'
        style={{ width: '64px' }} // Correct the attribute name to 'style' instead of 'staff'
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2'
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon='pi pi-trash'
          rounded
          outlined
          severity='danger'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <h4 className='m-0'>직원 관리</h4>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search...'
        />
      </span>
    </div>
  );

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancel'
        icon='pi pi-times'
        outlined
        onClick={hshop_seqeDialog}
      />
      <Button
        label='Save'
        icon='pi pi-check'
        onClick={saveProduct}
      />
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hshop_seqeDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const onUpload = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
    });
  };
  return (
    <div>
      <Toast ref={toast} />
      <div className='card'>
        <Toolbar
          className='mb-4'
          left={leftToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          dataKey='staff_seq'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} products'
          globalFilter={globalFilter}
          header={header}
          size='small'
        >
          <Column
            field='staff_image'
            header='이미지'
            body={imageBodyTemplate}
          ></Column>
          <Column
            field='staff_nickname'
            header='직원 닉네임'
            sortable
            staff={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='staff_name'
            header='직원 이름'
            sortable
            staff={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='staff_role'
            header='직급'
            sortable
            staff={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='staff_phone'
            header='직원 전화번호'
            sortable
            staff={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='staff_intro'
            header='직원 소개'
            sortable
            staff={{ minWidth: '10rem' }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            staff={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        staff={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='직원 등록'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hshop_seqeDialog}
      >
        {product.staff_image && (
          <img
            src={product.staff_image}
            className='product-staff block m-auto pb-3'
          />
        )}
        <div className='field'>
          <label
            htmlFor='staff_name'
            className='font-bold'
          >
            직원 이름
          </label>
          <InputText
            id='staff_name'
            value={product.staff_name}
            onChange={(e) => onInputChange(e, 'staff_name')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_name,
            })}
          />
          {submitted && !product.staff_name && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='staff_name'
            className='font-bold'
          >
            직원 닉네임
          </label>
          <InputText
            id='staff_nickname'
            value={product.staff_nickname}
            onChange={(e) => onInputChange(e, 'staff_nickname')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_nickname,
            })}
          />
          {submitted && !product.staff_nickname && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>

        <div className='field'>
          <label
            htmlFor='staff_role'
            className='font-bold'
          >
            직원 직급
          </label>
          <InputText
            id='staff_role'
            value={product.staff_role}
            onChange={(e) => onInputChange(e, 'staff_role')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_role,
            })}
          />
          {submitted && !product.staff_role && (
            <small className='p-error'>gender is required.</small>
          )}
        </div>

        <div className='field'>
          <label
            htmlFor='staff_phone'
            className='font-bold'
          >
            직원 전화번호
          </label>
          <InputText
            id='staff_phone'
            value={product.staff_phone}
            onChange={(e) => onInputChange(e, 'staff_phone')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_phone,
            })}
          />
          {submitted && !product.staff_phone && (
            <small className='p-error'>time is required.</small>
          )}
        </div>

        <div className='field'>
          <label
            htmlFor='staff_intro'
            className='font-bold'
          >
            직원 소개
          </label>
          <InputTextarea
            id='staff_intro'
            autoResize
            rows={5}
            cols={30}
            value={product.staff_intro}
            onChange={(e) => onInputChange(e, 'staff_intro')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_intro,
            })}
          />

          {submitted && !product.staff_intro && (
            <small className='p-error'>소개 is required.</small>
          )}
        </div>

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
            className='btn btn-secondary border-0 bg_grey'
            htmlFor='staff_image'
          >
            사진 추가
          </label>
        </div>

        {/* <div className='field'>
          <label
            htmlFor='staff_image'
            className='font-bold'
          >
            직원 프로필 사진
          </label>
          <FileUpload
            name='staff_image'
            id='staff_image'
            type='file'
            mode='basic'
            accept='.jpg'
            maxFileSize={1000000}
            onChange={handleImageUpload}
          />
        </div> */}
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        staff={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hshop_seqeDeleteProductDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            staff={{ fontSize: '2rem' }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.staff_nickname}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
