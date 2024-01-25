import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';

export default function Total() {
  const [reservation, setReservation] = useState([]);

  const getValueAndSeverity = (status) => {
    switch (status) {
      case 0:
        return { value: '예약 완료', severity: 'success' };
      case 1:
        return { value: '방문 완료', severity: 'danger' };
      case 2:
        return { value: '예약 취소', severity: 'info' };
      case 3:
        return { value: '노쇼', severity: 'danger' };
      default:
        return { value: '대기', severity: null };
    }
  };

  const statusBodyTemplate = (rowData) => {
    const { value: reserveValue, severity } = getValueAndSeverity(
      rowData.reserv_stat
    );

    return (
      <Tag
        value={reserveValue}
        severity={severity}
      />
    );
  };

  useEffect(() => {
    authAxios()
      .get(`/reservation/total/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        전체 예약 내역
      </h2>
      <DataTable
        value={reservation}
        paginator
        rows={10}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[10, 25, 50]}
      >
        <Column
          field='staff_nickname'
          header='담당 디자이너'
          sortable
        />
        <Column
          field='cust_name'
          header='고객 이름'
        />
        <Column
          field='style_name'
          header='헤어스타일'
          sortable
        />
        <Column
          field='reserv_date'
          header='예약날짜'
          sortable
        />
        <Column
          field='reserv_time'
          header='예약시간'
          sortable
        />
        <Column
          field='reserv_request'
          header='요청사항'
        />
        <Column
          field='reserv_stat'
          header='예약상태'
          sortable
          body={statusBodyTemplate}
        />
        <Column
          field='balance'
          header='결제금액'
          sortable
          dataType='numeric'
        />
      </DataTable>
    </div>
  );
}
