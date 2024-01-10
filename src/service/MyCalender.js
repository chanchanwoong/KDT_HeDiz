import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

class MyCalendar extends Component {
  render() {
    return (
      <div className='App'>
        <FullCalendar
          defaultView='dayGridMonth'
          plugins={[dayGridPlugin]}
          events={[
            { title: '이주 휴무일', date: '2024-01-25' },
            { title: '루하 휴무일', date: '2024-01-22' },
          ]}
        />
      </div>
    );
  }
}

export default MyCalendar;
