import { useState, useEffect } from 'react';
import Clock from 'react-live-clock';
import { authAxios } from 'api/AxiosAPI';
import { formatTime } from 'service/Utils';
import { getReservationValue } from 'service/CommonOptions';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

const RealtimeReservation = () => {
  const [reservation, setReservation] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    authAxios()
      .get(`/home/realtime-reservation/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservation(response.data);

        // fullCalendar
        const formattedEvents = response.data.map((event) => ({
          id: event.reserv_seq,
          title: event.style_name,
          start: `${event.reserv_date}T${event.reserv_time}`,
          end: `${event.reserv_date}T${event.end_time}`,
          extendedProps: {
            staff: event.staff_nickname,
            cust: event.cust_name,
            reserv_stat: event.reserv_stat,
          },
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const eventContent = (eventInfo) => {
    const { color } = getReservationValue(
      eventInfo.event.extendedProps.reserv_stat
    );
    console.log(color);
    return (
      <div style={{ backgroundColor: color }}>
        <p>{eventInfo.timeText}</p>
        <p>
          {eventInfo.event.extendedProps.staff} /{' '}
          {eventInfo.event.extendedProps.cust}
        </p>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const { value: reserveValue, color } = getReservationValue(
      rowData.reserv_stat
    );

    return (
      <Tag
        value={reserveValue}
        style={{ backgroundColor: color, width: '80px' }}
      />
    );
  };

  const customerTemplate = (rowData) => {
    return (
      <>
        <p>{rowData.cust_name}</p>
        <p className='text-sm'>{rowData.cust_phone}</p>
      </>
    );
  };

  const reservationTimeTemplate = (rowData) => {
    return (
      <>
        <p>{formatTime(rowData.reserv_time)} -</p>
        <p>{formatTime(rowData.end_time)}</p>
      </>
    );
  };

  const hairstyleTemplate = (rowData) => {
    return (
      <>
        <p>{rowData.style_name}</p>
        <p className='text-sm'>소요시간 {rowData.style_time}</p>
      </>
    );
  };

  const header = (
    <div className='flex flex-wrap align-items-center justify-content-between gap-2 px-2'>
      <Clock
        format={'YYYY년 MM월 DD일'}
        ticking={true}
      />
      <Button
        icon='pi pi-refresh'
        rounded
        raised
      />
    </div>
  );

  return (
    <>
      <div className='card h-full'>
        <h2 className='flex align-items-center justify-content-between'>
          금일 예약
        </h2>

        <div className='flex'>
          <div className='col-8'>
            <DataTable
              value={reservation}
              header={header}
              scrollable
              scrollHeight='800px'
              showGridlines
              size='small'
            >
              <Column
                field='reserv_seq'
                header='예약번호'
                className='text-center'
                sortable
              />
              <Column
                field='staff_nickname'
                header='담당 디자이너'
                className='text-center'
                sortable
              />
              <Column
                field='reserv_time'
                header='예약시간'
                sortable
                body={reservationTimeTemplate}
              />
              <Column
                field='style_name'
                header='헤어스타일'
                sortable
                body={hairstyleTemplate}
                className='text-center'
              />
              <Column
                field='cust_name'
                header='고객 정보'
                body={customerTemplate}
                className='text-center'
              />
              <Column
                field='reserv_request'
                header='요청사항'
                className='pl-4'
              />
              <Column
                field='reserv_stat'
                header='예약상태'
                sortable
                body={statusBodyTemplate}
                className='text-center'
              />
            </DataTable>
          </div>
          <div
            className='col-4'
            style={{ minHeight: '800px' }}
          >
            <FullCalendar
              locale='kr'
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView='timeGridDay'
              headerToolbar={false}
              footerToolbar={{
                right: 'timeGridDay,listDay',
              }}
              height='100%'
              themeSystem='standard'
              events={events}
              eventContent={eventContent}
              expandRows={true}
              // slotLabelInterval={'00:10:00'}
              slotDuration={'00:10:00'}
              // 영업 시작 일자
              slotMinTime={'09:00:00'}
              // 영업 종료 일자
              slotMaxTime={'23:00:00'}
              slotEventOverlap={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeReservation;
