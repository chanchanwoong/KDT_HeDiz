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
import callAxios from '../../service/CallAxios';

export default function Staff() {
  let emptyProduct = {
    staff_seq: 0,
    staff_nickname: '',
    staff_name: '',
    staff_role: '',
    staff_phone: '',
    staff_intro: '',
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

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

  const hstaff_seqeDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hstaff_seqeDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.style_name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.staff_seq) {
        const index = findIndexBystaff_seq(product.staff_seq);

        _products[index] = _product;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        _product.staff_seq = createstaff_seq();
        _product.style_image = 'product-placeholder.svg'; // Use 'style_image' instead of 'style_'
        _products.push(_product);
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

  const onInputChange = (e, style_name) => {
    const val = (e.target && e.target.value) || '';
    // Use spread operator for immutability
    setProduct({ ...product, [style_name]: val });
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${rowData.style_image}`} // Use 'style_image' instead of 'style_'
        alt={rowData.style_image} // Use 'style_image' instead of 'style_'
        className='shadow-2 border-round'
        style={{ width: '64px' }}
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
        onClick={hstaff_seqeDialog}
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
        onClick={hstaff_seqeDeleteProductDialog}
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
        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
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
            selectionMode='multiple'
            exportable={false}
          ></Column>
          <Column
            field='staff_image'
            header='프로필 사진'
            body={imageBodyTemplate}
          ></Column>
          <Column
            field='staff_nickname'
            header='닉네임'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='staff_name'
            header='이름'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='staff_role'
            header='권한'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='staff_phone'
            header='전화번호'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='staff_intro'
            header='소개'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Product Details'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hstaff_seqeDialog}
      >
        {product.style_image && (
          <img
            src={`https://primefaces.org/cdn/primereact/images/product/${product.style_image}`}
            alt={product.style_image}
            className='product-style block m-auto pb-3'
          />
        )}
        <div className='field'>
          <label
            htmlFor='style_name'
            className='font-bold'
          >
            닉네임
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
            권한
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
            <small className='p-error'>role is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='staff_phone'
            className='font-bold'
          >
            전화번호
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
            <small className='p-error'>phone is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='style_time'
            className='font-bold'
          >
            소개
          </label>
          <InputTextarea
            autoResize
            rows={5}
            cols={30}
            id='staff_intro'
            value={product.staff_intro}
            onChange={(e) => onInputChange(e, 'staff_intro')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.staff_intro,
            })}
          />
          {submitted && !product.staff_intro && (
            <small className='p-error'>intro is required.</small>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hstaff_seqeDeleteProductDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.style_name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
