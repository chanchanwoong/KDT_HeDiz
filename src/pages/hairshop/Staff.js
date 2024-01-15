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
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import callAxios from 'service/CallAxios';

export default function staff() {
  let emptyProduct = {
    shop_seq: 0,
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

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const toast = useRef(null);

  const categoryOptions = [
    { cate_name: '커트', cate_seq: 1 },
    { cate_name: '펌', cate_seq: 2 },
    { cate_name: '염색', cate_seq: 3 },
    { cate_name: '클리닉', cate_seq: 4 },
    { cate_name: '스타일링', cate_seq: 5 },
  ];
  const onUpload = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
    });
  };
  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/staff')
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

  const saveProduct = async () => {
    setSubmitted(true);

    if (product.staff_nickname.trim()) {
      let _products = [...products];
      let _product = { ...product };
      console.log(_product);
      try {
        if (product.staff_seq) {
          const index = findIndexBystaff_seq(product.staff_seq);

          _products[index] = _product;
          await axios.put(
            `http://localhost:8080/hairshop/staff/${product.staff_seq}`,
            _product
          );

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
          await axios.post('http://localhost:8080/hairshop/staff/', _product);
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
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${rowData.staff_image}`} // Use 'staff_image' instead of 'staff_'
        alt={rowData.staff_image} // Use 'staff_image' instead of 'staff_'
        className='shadow-2 border-round'
        staff={{ width: '64px' }}
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
            src={`https://primefaces.org/cdn/primereact/images/product/${product.staff_image}`}
            alt={product.staff_image}
            className='product-staff block m-auto pb-3'
          />
        )}
        <div className='field'>
          <label
            htmlFor='staff_nickname'
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
        <div className='field'>
          <label
            htmlFor='staff_intro'
            className='font-bold'
          >
            직원 프로필 사진
          </label>
          <FileUpload
            mode='basic'
            name='demo[]'
            url='/api/upload'
            accept='image/*'
            maxFileSize={1000000}
            onUpload={onUpload}
          />
        </div>
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
