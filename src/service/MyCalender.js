import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './MyCalender.css';

class MyCalendar extends Component {
  render() {
    const { parsedDate } = this.props;
    console.log({ parsedDate });

    const events = [
      { title: '이주 휴무일', date: '2024-01-25' },
      { title: '루하 휴무일', start: '2024-01-22', end: '2024-01-23' },
    ];

    if (parsedDate) {
      let start = parsedDate.parsedStartDate;
      let end = parsedDate.parsedEndDate;
      console.log(start, end);
      console.log('실행');
      events.push({
        title: '미용실 휴무',
        start: start,
        end: end,
        color: '#fc4e4e',
      });
      console.log(start, end);
    }
    console.log(events);
    return (
      <div className='App'>
        <FullCalendar
          defaultView='dayGridMonth'
          plugins={[dayGridPlugin]}
          events={events}
          displayEventTime={false}
        />
      </div>
    );
  }
}

export default MyCalendar;
