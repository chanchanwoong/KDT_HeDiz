import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Tag } from 'primereact/tag';

function Management() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/customer/1')
      .then((response) => {
        console.log(response.data);
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderHeader = () => {
    return (
      <div className='flex flex-wrap gap-2 justify-content-between align-items-center'>
        <h4 className='m-0'>전체 고객 목록</h4>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className='card'>
      <DataTable
        value={customers}
        paginator
        header={header}
        rows={10}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[10, 25, 50]}
      >
        <Column
          field='cust_name'
          header='고객 이름'
          style={{ minWidth: '14rem' }}
        />
        <Column
          field='cust_id'
          header='고객 id'
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field='cust_phone'
          header='전화번호'
          sortable
          style={{ minWidth: '12rem' }}
        />

        <Column
          field='cust_gender'
          header='성별'
          sortable
          dataType='date'
          style={{ minWidth: '12rem' }}
        />
        <Column
          field='cust_visit'
          header='방문횟수'
          sortable
          style={{ minWidth: '12rem' }}
        />
        <Column
          headerStyle={{ width: '5rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
        />
      </DataTable>
    </div>
  );
}

export default Management;
