import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import Clock from 'react-live-clock';
import { formatTime } from 'service/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { authAxios } from 'api/AxiosAPI';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import DashboardChart from 'components/common/DashboardChart';
import { getReservationValue } from 'service/CommonOptions';
import { Tag } from 'primereact/tag';

function Dashboard() {
  const [reservation, setReservation] = useState([]);
  const [closedDay, setClosedDay] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const reservationInfoTemplate = (rowData) => {
    return (
      <>
        <p className='font-semibold'>{rowData.style_name}</p>
        <p>
          {formatTime(rowData.reserv_time)} - {formatTime(rowData.end_time)}
        </p>
        <p>{rowData.reserv_request}</p>
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const { value: reserveValue, color } = getReservationValue(
      rowData.reserv_stat
    );

    return (
      <Tag
        value={reserveValue}
        style={{ backgroundColor: color, width: '80px', borderRadius: '40px' }}
      />
    );
  };

  useEffect(() => {
    //////// tempday_shop tempday_staff 둘다 받아오기
    const request1 = authAxios().get(
      `/home/realtime-reservation/${localStorage.getItem('shop_seq')}`
    );
    const request2 = authAxios().get(
      `/hairshop/closed-day/shop/${localStorage.getItem('shop_seq')}`
    );
    const request3 = authAxios().get(
      `/hairshop/closed-day/staff/${localStorage.getItem('shop_seq')}`
    );

    const calendar = calendarRef.current.getApi();
    calendar.setOption('plugins', [dayGridPlugin]);
    calendar.setOption('initialView', 'dayGridMonth');

    axios;
    axios
      .all([request1, request2, request3])
      .then(
        axios.spread((res1, res2, res3) => {
          console.log('Response from request1:', res1.data);
          console.log('Response from request2:', res2.data);
          console.log('Response from request3:', res3.data);
          const combinedData = [...res2.data, ...res3.data];
          const eventList = combinedData.map((item) => ({
            title: `${
              item.staff_nickname ? item.staff_nickname : '전체 휴무'
            }: ${item.temp_memo}`,
            start: `${item.temp_start}`,
            end: `${item.temp_end}`,
            description: item.temp_memo,
          }));

          setReservation(res1.data);
          setClosedDay(combinedData);
          setEvents(eventList);
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.item} card`}>
          <h4>예약완료</h4>
          {/* <h3>24</h3> */}
        </div>
        <div className={`${styles.item} card`}>
          <h4>예약취소</h4>
          {/* <h3>2</h3> */}
        </div>
        <div className={`${styles.item} card`}>
          <h4>노쇼</h4>
          {/* <h3>2</h3> */}
        </div>
        <div className={`${styles.item} card`}>
          <h4>금월 매출</h4>
          {/* <h3>4</h3> */}
        </div>
        <div className={`${styles.item} card`}>
          <h2 className='flex align-items-center justify-content-between'>
            <span>
              <span className='mr-1 text-primary text-semiblod'>
                {localStorage.getItem('shop_name')}
              </span>
              실시간 예약
            </span>
            <Clock
              format={'YY년 MM월 DD일 HH:mm:ss'}
              ticking={true}
            />
          </h2>
          <div>
            <DataTable
              value={reservation}
              rows={5}
              size='small'
              scrollable
              scrollHeight='800px'
              className='mt-2'
            >
              <Column
                field='staff_nickname'
                header='담당'
                className='text-center'
              />
              <Column
                field='cust_name'
                header='고객 이름'
                className='text-center font-semibold'
              />
              <Column
                field='reserv_request'
                header='예약 정보'
                body={reservationInfoTemplate}
              />
              <Column
                field='reserv_stat'
                header='예약 상태'
                body={statusBodyTemplate}
                className='text-center'
              />
            </DataTable>
          </div>
        </div>
        <div className={`${styles.item} card`}>
          <h2 className='flex align-items-center justify-content-between'>
            <span>매출 요약</span>
          </h2>
          <div></div>
        </div>
        <div className={`${styles.item} card`}>
          <h2 className='flex align-items-center justify-content-between'>
            <span>휴무일</span>
            <span className='text-lg'>
              <span className='mr-1 text-primary text-semiblod'>월요일</span>
              정기 휴무
            </span>
          </h2>
          <div className={styles.custom}>
            <FullCalendar
              locale='kr'
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView='dayGridMonth'
              events={events}
              headerToolbar={false}
            />
          </div>
        </div>
        <div className={`${styles.item} card`}>
          <h2 className='flex align-items-center justify-content-between'>
            <span>고객 방문 현황</span>
          </h2>
          <div>{/* <DashboardChart /> */}</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
