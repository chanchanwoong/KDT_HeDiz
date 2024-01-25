import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { formatTime, formatNumberWithCommas } from 'service/Utils';
import { getReservationValue } from 'service/CommonOptions';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export default function Total() {
  const [reservation, setReservation] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  const statusBodyTemplate = (rowData) => {
    const { value: reserveValue, color } = getReservationValue(
      rowData.reserv_stat
    );

    return (
      <Tag
        value={reserveValue}
        style={{ backgroundColor: color, width: '100px' }}
      />
    );
  };

  const statusEditor = (options) => {
    const allReservStats = reservation.map(
      (reservation) => reservation.reserv_stat
    );
    const uniqueReservStats = [...new Set(allReservStats)];
    const reservStatStrings = uniqueReservStats.map(
      (stat) => getReservationValue(stat).value
    );

    return (
      <Dropdown
        value={getReservationValue(options.rowData.reserv_stat).value}
        options={reservStatStrings}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder='Select a Status'
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

  const onRowEditComplete = (e) => {
    console.log(e);
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        <span>
          전체 예약 내역{' '}
          {` (총 ${
            reservation ? formatNumberWithCommas(reservation.length) : 0
          } 건)`}
        </span>
        <div>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText
              type='search'
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder='검색'
              className='p-inputtext-sm'
            />
          </span>
        </div>
      </h2>
      <DataTable
        value={reservation}
        paginator
        showGridlines
        rows={10}
        globalFilter={globalFilter}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[10, 25, 50]}
        // 수정 모드
        editMode='row'
        onRowEditComplete={onRowEditComplete}
      >
        <Column
          field='staff_nickname'
          header='담당 디자이너'
          className='text-center'
          sortable
        />
        <Column
          field='cust_name'
          header='고객 이름'
          className='text-center'
        />
        <Column
          field='style_name'
          header='헤어스타일'
          className='text-center'
          sortable
        />
        <Column
          field='reserv_date'
          header='예약날짜'
          className='text-center'
          sortable
        />
        <Column
          field='reserv_time'
          header='예약시간'
          className='text-center'
          body={(rowData) => <span>{formatTime(rowData.reserv_time)}</span>}
          sortable
        />
        <Column
          field='reserv_request'
          header='요청사항'
        />

        <Column
          field='balance'
          header='결제금액'
          sortable
          dataType='numeric'
        />
        <Column
          field='reserv_stat'
          header='예약상태'
          sortable
          className='text-center'
          editor={(options) => statusEditor(options)}
          body={statusBodyTemplate}
        />
        <Column
          header='수정'
          rowEditor={true}
          headerStyle={{ minWidth: '6rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
      </DataTable>
    </div>
  );
}
