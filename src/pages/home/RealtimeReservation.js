import { useState, useEffect, useRef } from 'react';
import Clock from 'react-live-clock';
import { authAxios } from 'api/AxiosAPI';
import { formatTime } from 'service/Utils';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { CustomerService } from 'service/CustomerService';

const RealtimeReservation = () => {
  const [reservation, setReservation] = useState([]);

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

  const getValueAndSeverity = (status) => {
    switch (status) {
      case 0:
        return { value: '대기', severity: 'success' };
      case 1:
        return { value: '수락', severity: 'danger' };
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

  const confirmTemplate = (rowData, options) => {
    return (
      <>
        <Button
          icon='pi pi-check'
          label='수락'
        ></Button>
        <Button
          icon='pi pi-times'
          label='거절'
          className='p-button-danger'
        ></Button>
      </>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <div className='flex align-items-center gap-2'>
        <img
          alt={rowData.representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.representative.image}`}
          width='32'
        />
        <span className='font-bold'>{rowData.representative.name}</span>
      </div>
    );
  };

  const getSeverity = (status) => {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  };

  return (
    <>
      <div className='card w-full'>
        <h2 className='flex align-items-center justify-content-between'>
          실시간 예약
          <Clock
            format={'YYYY년 MM월 DD일 HH : mm : ss'}
            ticking={true}
            // timezone={'KR/Pacific'}
          />
        </h2>

        <div className='flex'>
          <div className='col-8'>
            <DataTable
              value={reservation}
              sortField='representative.name'
              // sortOrder={1}
              tableStyle={{ minWidth: '50rem' }}
              scrollable
              scrollHeight='800px'
              showGridlines
              size='small'
            >
              <Column
                field='reserv_seq'
                header='예약번호'
                sortable
              />
              <Column
                field='reserv_time'
                header='예약시간'
                sortable
              />
              <Column
                style={{ flex: '0 0 4rem' }}
                body={confirmTemplate}
              />
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
              {/* <Column
                field='reserv_request'
                header='요청사항'
              /> */}
              <Column
                field='reserv_stat'
                header='예약상태'
                sortable
                body={statusBodyTemplate}
              />
              {/* <Column
                field='balance'
                header='결제금액'
                sortable
                dataType='numeric'
              /> */}
            </DataTable>
          </div>
          <div className='col-4'>
            <FullCalendar
              locale='kr'
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView='timeGridDay'
              headerToolbar={false}
              height='100%'
              themeSystem='standard'
              // headerToolbar={{
              //   start: 'title',
              //   right: '',
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeReservation;
