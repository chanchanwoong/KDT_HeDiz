import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Management() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    authAxios()
      .get(`/customer/total/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const renderCustomerLevel = (rowData) => {
    const custLevel = rowData.cust_level;

    if (custLevel === 1) {
      return <span className='label label__vip'>VIP</span>;
    } else {
      return <span className='label label__default'>일반고객</span>;
    }
  };

  const reservationHistory = (rowData) => {
    return (
      <span>
        <b>{rowData.staff_nickname}</b> {rowData.style_name}
      </span>
    );
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        고객 방문 이력
      </h2>
      <DataTable
        value={customers}
        paginator
        rows={10}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        currentPageReportTemplate='총 {totalRecords}건의 고객 방문 이력이 검색되었습니다. '
        rowsPerPageOptions={[10, 25, 50]}
      >
        <Column
          field='cust_level'
          header='등급'
          sortable
          style={{ minWidth: '8rem' }}
          body={renderCustomerLevel}
          className='text-center'
        />
        <Column
          field='cust_name'
          header='성함'
          sortable
          className='text-center'
        />
        <Column
          field='cust_phone'
          header='전화번호'
          sortable
          className='text-center'
        />
        <Column
          field='stat_complete'
          header='정상 방문 횟수'
          sortable
          style={{ minWidth: '8rem' }}
          className='text-center'
        />
        <Column
          field='stat_cancel'
          header='예약 취소 횟수'
          sortable
          style={{ minWidth: '8rem' }}
          className='text-center'
        />
        <Column
          field='stat_noshow'
          header='노쇼 횟수'
          sortable
          style={{ minWidth: '8rem' }}
          className='text-center'
        />
        <Column
          field='all_shop_noshow'
          header='전체 노쇼 횟수'
          sortable
          style={{ minWidth: '8rem' }}
          className='text-center'
        />

        <Column
          field='last_reserv_date'
          header='마지막 예약 날짜'
          sortable
          style={{ minWidth: '8rem' }}
          className='text-center'
        />
        <Column
          field='style_name'
          header='마지막 예약 정보'
          sortable
          style={{ minWidth: '8rem' }}
          body={reservationHistory}
          className='pl-2'
        />
      </DataTable>
    </div>
  );
}

export default Management;
