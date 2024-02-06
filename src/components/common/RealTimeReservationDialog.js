import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { getReservationValue } from 'service/CommonOptions';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { Dialog } from 'primereact/dialog';

export default function RealtimeReservationDialog({ isOpen, onClose, title }) {
  const [reservation, setReservation] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isOpen) {
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
              style: event.style_name,
            },
          }));
          setEvents(formattedEvents);
        })
        .catch((error) => {
          console.error('Auth Error:', error);
        });
    }
  }, [isOpen]);

  const eventContent = (eventInfo) => {
    const { color } = getReservationValue(
      eventInfo.event.extendedProps.reserv_stat
    );
    return (
      <div
        className='text-sm pl-2 mt-2'
        style={{ color: 'black', borderLeft: `5px solid ${color}` }}
      >
        <p>{eventInfo.timeText}</p>
        <p>
          <span className='mr-1'>고객 이름</span>
          <b>{eventInfo.event.extendedProps.cust}</b>
        </p>
        <p>
          <span className='mr-1'>예약 정보</span>
          <b>
            {eventInfo.event.extendedProps.staff} -{' '}
            {eventInfo.event.extendedProps.style}
          </b>
        </p>
      </div>
    );
  };

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      className='w-5 h-30rem'
      header={title}
      modal
      style={{ width: '800px', minHeight: '70vh' }}
    >
      <FullCalendar
        locale='kr'
        plugins={[dayGridPlugin, listPlugin]}
        initialView='listDay'
        headerToolbar={false}
        footerToolbar={{
          right: 'listDay',
        }}
        height='100%'
        themeSystem='standard'
        events={events}
        eventContent={eventContent}
        expandRows={true}
        slotDuration={'00:10:00'}
        slotMinTime={'09:00:00'}
        slotMaxTime={'23:00:00'}
        slotEventOverlap={false}
      />
    </Dialog>
  );
}
