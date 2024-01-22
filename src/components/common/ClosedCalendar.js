import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

function ClosedCalendar() {
  const [events, setEvents] = useState([]);

  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = calendarRef.current.getApi();

    // FullCalendar 설정
    calendar.setOption('plugins', [dayGridPlugin, timeGridPlugin]);
    calendar.setOption('initialView', 'timeGridWeek');

    authAxios()
      .get(`/hairshop/closed-day/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setClosdedDay(response.data);

        // 이벤트 데이터 생성
        const eventList = response.data.map((item) => ({
          title: `${item.staff_nickname}: ${item.temp_memo}`,
          start: item.temp_start,
          end: item.temp_end,
          description: item.temp_memo,
        }));

        const regularDays =
          response.data[0]?.shop_regular.split(',').map(Number) || [];

        // 요일 데이터 매핑
        const daysMapping = [
          { label: '휴무일 없음', value: '0' },
          { label: '일요일', value: '1' },
          { label: '월요일', value: '2' },
          { label: '화요일', value: '3' },
          { label: '수요일', value: '4' },
          { label: '목요일', value: '5' },
          { label: '금요일', value: '6' },
          { label: '토요일', value: '7' },
        ];

        // 매주 정기 휴무일을 표현하는 반복 이벤트 생성
        const recurringEvents = regularDays.map((day) => ({
          title: '정기 휴무일',
          daysOfWeek: [day - 1],
          editable: false,
          backgroundColor: 'rgb(100 117 139)',
        }));

        // 기존 이벤트와 매주 정기 휴무일을 합침
        const combinedEvents = [...eventList, ...recurringEvents];
        // FullCalendar에 이벤트 설정
        setEvents(combinedEvents);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  return (
    <>
      <FullCalendar
        locale='kr'
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView='dayGridMonth'
        events={events}
      />
    </>
  );
}

export default ClosedCalendar;
