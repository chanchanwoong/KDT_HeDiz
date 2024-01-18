import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';

export default function Total() {
  const [reservation, setReservation] = useState([]);
  const token = localStorage.getItem('jwtauthtoken');
  const shop_seq = localStorage.getItem('shop_seq');

  const getValueAndSeverity = (status) => {
    switch (status) {
      case 0:
        return { value: '대기', severity: 'info' };
      case 1:
        return { value: '수락', severity: 'success' };
      case 2:
        return { value: '거절', severity: 'danger' };
      default:
        return { value: '', severity: null };
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const [year, month, day] = new Date(dateString)
      .toLocaleDateString('ko-KR', options)
      .split('.')
      .map((part) => part.trim());

    return `${year}-${month}-${day}`;
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString('ko-KR', options);
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/reservation/total/' + shop_seq, {
        headers: { jwtauthtoken: token },
      })
      .then((response) => {
        console.log(response.data);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Panel header='전체 예약 내역'>
      <div className='card'>
        <DataTable
          value={reservation}
          paginator
          rows={10}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          rowsPerPageOptions={[10, 25, 50]}
        >
          <Column
            field='cust_name'
            header='고객 이름'
          />
          <Column
            field='staff_nickname'
            header='담당 디자이너'
            sortable
          />

          <Column
            field='style_name'
            header='헤어스타일'
          />

          <Column
            field='reserv_time'
            header='예약날짜'
            sortable
            body={(rowData) => formatDate(rowData.reserv_time)}
          />

          <Column
            field='reserv_time'
            header='예약시간'
            sortable
            // dataType='date'
            body={(rowData) => formatTime(rowData.reserv_time)}
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
          <Column
            headerStyle={{ width: '5rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
          />
        </DataTable>
      </div>
    </Panel>
  );
}
