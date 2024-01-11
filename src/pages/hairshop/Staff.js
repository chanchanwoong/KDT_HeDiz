import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
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
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
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

  const hstaff_seqeDeleteProductDialog = () => {
    setDeleteProductDialog(false);
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
          {product && <span>정말로 삭제하시겠습니까?</span>}
        </div>
      </Dialog>
    </div>
  );
}
