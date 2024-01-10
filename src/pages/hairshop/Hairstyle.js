import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';

export default function Hairstyle() {
  let emptyProduct = {
    style_seq: 0,
    style_name: '',
    style_gender: '',
    style_time: '',
    style_price: null,
    style_intro: '',
    style_image: null,
    cate_seq: null,
    shop_seq: null,
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/hairstyle')
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

  const hshop_seqeDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.style_name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.shop_seq) {
        const index = findIndexByshop_seq(product.shop_seq);

        _products[index] = _product;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        _product.shop_seq = createshop_seq();
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
    let _products = products.filter((val) => val.shop_seq !== product.shop_seq);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
  };

  const findIndexByshop_seq = (shop_seq) => {
    return products.findIndex((product) => product.shop_seq === shop_seq);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    // Use Array.filter to create a new array without selectedProducts
    let _products = products.filter(
      (product) => !selectedProducts.includes(product.shop_seq)
    );

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
  };

  const onInputChange = (e, style_name) => {
    const val = (e.target && e.target.value) || '';
    // Use spread operator for immutability
    setProduct({ ...product, [style_name]: val });
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
        <Button
          label='Delete'
          icon='pi pi-trash'
          severity='danger'
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
    );
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
      <h4 className='m-0'>헤어스타일 목록</h4>
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

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hshop_seqeDeleteProductsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteSelectedProducts}
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
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey='style_seq'
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
            field='style_image'
            header='이미지'
            body={imageBodyTemplate}
          ></Column>
          <Column
            field='style_name'
            header='헤어스타일 명'
            sortable
            style={{ minWidth: '16rem' }}
          ></Column>
          <Column
            field='style_price'
            header='가격'
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field='style_gender'
            header='시술대상'
            sortable
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='style_time'
            header='작업시간'
            sortable
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='cate_seq'
            header='카테고리'
            sortable
            style={{ minWidth: '10rem' }}
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
        onHide={hshop_seqeDialog}
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
            이름
          </label>
          <InputText
            id='style_name'
            value={product.style_name}
            onChange={(e) => onInputChange(e, 'style_name')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_name,
            })}
          />
          {submitted && !product.style_name && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='style_price'
            className='font-bold'
          >
            가격
          </label>
          <InputText
            id='style_price'
            value={product.style_price}
            onChange={(e) => onInputChange(e, 'style_price')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_price,
            })}
          />
          {submitted && !product.style_price && (
            <small className='p-error'>price is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='style_gender'
            className='font-bold'
          >
            시술대상
          </label>
          <InputText
            id='style_gender'
            value={product.style_gender}
            onChange={(e) => onInputChange(e, 'style_gender')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_gender,
            })}
          />
          {submitted && !product.style_gender && (
            <small className='p-error'>gender is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='style_time'
            className='font-bold'
          >
            작업시간
          </label>
          <InputText
            id='style_time'
            value={product.style_price}
            onChange={(e) => onInputChange(e, 'style_time')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_time,
            })}
          />
          {submitted && !product.style_time && (
            <small className='p-error'>price is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='cate_seq'
            className='font-bold'
          >
            카테고리
          </label>
          <InputText
            id='cate_seq'
            value={product.cate_seq}
            onChange={(e) => onInputChange(e, 'cate_seq')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.cate_seq,
            })}
          />
          {submitted && !product.cate_seq && (
            <small className='p-error'>카테고리 is required.</small>
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
        onHide={hshop_seqeDeleteProductDialog}
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

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductsDialogFooter}
        onHide={hshop_seqeDeleteProductsDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {selectedProducts && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
