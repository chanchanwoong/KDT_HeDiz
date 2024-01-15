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

export default function Hairstyle() {
  let emptyProduct = {
    shop_seq: 0,
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

  const saveProduct = async () => {
    setSubmitted(true);

    if (product.style_name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      console.log(_product);
      try {
        if (product.style_seq) {
          const index = findIndexByStyle_seq(product.style_seq);

          _products[index] = _product;
          await axios.put(
            `http://localhost:8080/hairshop/hairstyle/${product.style_seq}`,
            _product
          );

          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Updated',
            life: 3000,
          });
        } else {
          _product.style_seq = _products.length + 1;
          _product.style_image = 'product-placeholder.svg'; // Use 'style_image' instead of 'style_'
          _products.push(_product);
          await axios.post(
            'http://localhost:8080/hairshop/hairstyle/',
            _product
          );
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
      (val) => val.style_seq !== product.style_seq
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
      url: 'http://localhost:8080/hairshop/hairstyle/' + product.style_seq,
    });
  };

  const findIndexByStyle_seq = (style_seq) => {
    return products.findIndex((product) => product.style_seq === style_seq);
  };

  const onInputChange = (e, style_name) => {
    const val = (e.target && e.target.value) || '';
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
            field='style_image'
            header='이미지'
            body={imageBodyTemplate}
          ></Column>
          <Column
            field='style_name'
            header='헤어스타일 명'
            sortable
            style={{ minWidth: '10rem' }}
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
            field='style_intro'
            header='소개'
            sortable
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='cate_name'
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
        header='헤어스타일 등록'
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
            헤어스타일 명
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
            value={product.style_time}
            onChange={(e) => onInputChange(e, 'style_time')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_time,
            })}
          />
          {submitted && !product.style_time && (
            <small className='p-error'>time is required.</small>
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
            htmlFor='style_intro'
            className='font-bold'
          >
            스타일 소개
          </label>
          <InputTextarea
            id='style_intro'
            autoResize
            rows={5}
            cols={30}
            value={product.style_intro}
            onChange={(e) => onInputChange(e, 'style_intro')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.style_intro,
            })}
          />

          {submitted && !product.style_intro && (
            <small className='p-error'>소개 is required.</small>
          )}
        </div>
        <div className='field'>
          <label
            htmlFor='style_intro'
            className='font-bold'
          >
            스타일 이미지
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

        <div className='field'>
          <label
            htmlFor='cate_name'
            className='font-bold'
          >
            카테고리
          </label>
          <Dropdown
            id='cate_name'
            value={selectedCategory}
            onChange={(e) => {
              const selectedOption = categoryOptions.find(
                (option) => option.cate_seq === e.value
              );
              setSelectedCategory(e.value);

              setProduct({
                ...product,
                cate_seq: e.value,
                cate_name: selectedOption ? selectedOption.cate_name : '', // Ensure to handle undefined
              });
            }}
            options={categoryOptions}
            optionLabel='cate_name'
            optionValue='cate_seq'
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.cate_name,
            })}
          />
          {submitted && !product.cate_name && (
            <small className='p-error'>카테고리는 필수 항목입니다.</small>
          )}
        </div>
        {/* <div className='field'>
          <label
            htmlFor='cate_name'
            className='font-bold'
          >
            카테고리
          </label>
          <InputText
            id='cate_name'
            value={product.cate_name}
            onChange={(e) => onInputChange(e, 'cate_name')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.cate_name,
            })}
          />
          {submitted && !product.cate_name && (
            <small className='p-error'>price is required.</small>
          )}
        </div> */}
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
    </div>
  );
}
