import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

class MyCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8080/hairshop/closed-day/1')
      .then((res) => {
        console.log(res.data);
        this.setState({ info: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { info } = this.state;
    const events = [];
    const { staffName, parsedDate } = this.props;

    if (parsedDate) {
      const startDate = new Date(parsedDate.parsedStartDate);
      const endDate = new Date(parsedDate.parsedEndDate);

      const formattedStartDate = `${startDate.getFullYear()}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

      const formattedEndDate = `${endDate.getFullYear()}-${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

      const date = `${formattedStartDate} ~ ${formattedEndDate}`;
      const title = staffName || '미용실 휴무';

      const postData = {
        date: date,
        title: title,
      };

      axios
        .post('http://localhost:8080/hairshop/closed-day', postData)
        .then((res) => {
          console.log(res.data);
          // Handle the response if needed
        })
        .catch((error) => {
          console.log(error);
          // Handle the error if needed
        });
    }

    if (info.length > 0) {
      // 배열의 각 날짜를 events에 추가
      info.forEach((item) => {
        let newDate = item.date.split(',').map((date) => date.trim());

        events.push({
          title: item.title, // 날짜마다 미용실 휴무로 설정
          start: newDate[0],
          end: newDate[1],
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });
      });
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
