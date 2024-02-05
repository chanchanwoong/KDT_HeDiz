import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { formatTime, formatNumberWithCommas } from 'service/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

export default function Total() {
  const toast = useRef(null);
  const [reservation, setReservation] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectRowData, setSelectRowData] = useState([]);

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: '예약상태 변경을 완료했습니다.',
      life: 3000,
    });
  };

  const showReject = () => {
    toast.current.show({
      severity: 'error',
      summary: 'error',
      detail: '예약상태 변경을 실패했습니다.',
      life: 3000,
    });
  };

  const getStatus = (value) => {
    switch (value) {
      case 0:
        return { value: '예약 완료', color: '#049bff' };
      case 1:
        return { value: '방문 완료', color: '#8b5cf6' };
      case 2:
        return { value: '예약 취소', color: '#ffaa00' };
      case 3:
        return { value: '노쇼', color: '#ff416a' };
      case 4:
        return { value: '대기', color: '#76818d' };

      default:
        return null;
    }
  };

  const reservStat = [
    { name: '방문 완료', value: 1 },
    { name: '노쇼', value: 3 },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    authAxios()
      .get(`/reservation/total/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={getStatus(rowData.reserv_stat).value}
        style={{
          backgroundColor: getStatus(rowData.reserv_stat).color,
          width: '80px',
          borderRadius: '40px',
          padding: '6px',
        }}
      />
    );
  };

  const statusEditor = (options) => {
    if (options.rowData) {
      setSelectRowData(options.rowData);
    }
    if (selectRowData && selectRowData.reserv_stat === 0) {
      return (
        <Dropdown
          value={options.value}
          options={reservStat}
          optionLabel='name'
          optionValue='value'
          placeholder='예약상태를 확정해주세요'
          onChange={(e) => {
            if (selectRowData) {
              selectRowData.reserv_stat = e.value;
              console.log('final selectRowData : ', selectRowData);
              authAxios()
                .put(`/reservation/${selectRowData.reserv_seq}/${e.value}`)
                .then((response) => {
                  console.log('Auth Response:', response.data);
                  loadData();
                  setSelectRowData([]);
                  showSuccess();
                })
                .catch((error) => {
                  console.error('Auth Error:', error);
                  showReject();
                });
            }
          }}
        />
      );
    } else {
      console.log(options.rowData);
      return (
        <Tag
          value={getStatus(options.rowData.reserv_stat).value}
          style={{
            backgroundColor: getStatus(options.rowData.reserv_stat).color,
            width: '80px',
            borderRadius: '40px',
            padding: '6px',
          }}
        />
      );
    }
  };

  return (
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        <span>전체 예약 내역</span>
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
        editMode='cell'
        currentPageReportTemplate='총 {totalRecords}건의 예약 내역이 검색되었습니다. '
      >
        <Column
          field='reserv_seq'
          header='예약 번호'
          className='text-center'
          sortable
        />
        <Column
          field='staff_nickname'
          header='담당'
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
          field='style_name'
          header='헤어스타일'
          className='text-center'
          sortable
        />
        <Column
          field='cust_name'
          header='고객 이름'
          className='text-center'
        />
        <Column
          field='reserv_request'
          header='요청사항'
        />
        <Column
          field='pay_price'
          header='결제금액'
          sortable
          dataType='numeric'
          body={(rowData) => (
            <span>{formatNumberWithCommas(rowData.pay_price)}</span>
          )}
          className='text-right'
        />
        <Column
          field='reserv_stat'
          header='예약상태'
          sortable
          className='text-center'
          editor={(options) => statusEditor(options)}
          body={statusBodyTemplate}
        />
      </DataTable>
      <Toast ref={toast} />
    </div>
  );
}
