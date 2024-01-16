import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';

export default function Total() {
  const [reservation, setReservation] = useState([]);

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
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Panel header='전체 예약'>
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
            style={{ minWidth: '10rem' }}
          />
          <Column
            field='staff_nickname'
            header='담당 디자이너'
            sortable
            style={{ minWidth: '10rem' }}
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
    </Panel>
  );
}
