import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Tag } from 'primereact/tag';

export default function Total() {
  const [customers, setCustomers] = useState([]);

  const getReserveValue = (status) => {
    switch (status) {
      case 0:
        return '대기';
      case 1:
        return '수락';
      case 2:
        return '거절';
      default:
        return '';
    }
  };

  const getSeverity = (status) => {
    switch (status) {
      case 0:
        return 'info';
      case 1:
        return 'success';
      case 2:
        return 'danger';
      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    const reserveValue = getReserveValue(rowData.reserv_stat);
    const severity = getSeverity(rowData.reserv_stat);

    return (
      <Tag
        value={reserveValue}
        severity={severity}
      />
    );
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/reservation/total')
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
        <h4 className='m-0'>전체 예약 목록</h4>
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
          field='staff_nickname'
          header='담당 디자이너'
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field='reserv_time'
          header='예약날짜'
          sortable
          style={{ minWidth: '12rem' }}
        />

        <Column
          field='time'
          header='예약시간'
          sortable
          dataType='date'
          style={{ minWidth: '12rem' }}
        />
        <Column
          field='balance'
          header='결제금액'
          sortable
          dataType='numeric'
          style={{ minWidth: '12rem' }}
        />
        <Column
          field='reserv_stat'
          header='예약상태'
          sortable
          style={{ minWidth: '12rem' }}
          body={statusBodyTemplate}
        />
        <Column
          field='style_name'
          header='헤어스타일'
        />
        <Column
          field='reserv_request'
          header='요청사항'
        />
        <Column
          headerStyle={{ width: '5rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
        />
      </DataTable>
    </div>
  );
}
