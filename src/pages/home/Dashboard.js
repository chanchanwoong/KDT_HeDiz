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
import DashboardChart from 'components/common/DashboardChart';

function Dashboard() {
  const [reservation, setReservation] = useState([]);
  const [closedDay, setClosedDay] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const reservationTimeTemplate = (rowData) => {
    return (
      <>
        <p>{formatTime(rowData.reserv_time)}</p>
        <p>- {formatTime(rowData.end_time)}</p>
      </>
    );
  };

  const reservationInfoTemplate = (rowData) => {
    return (
      <>
        <p className='font-semibold'>{rowData.style_name}</p>
        <p>{rowData.reserv_request}</p>
      </>
    );
  };

  useEffect(() => {
    const request1 = authAxios().get(
      `/home/realtime-reservation/${localStorage.getItem('shop_seq')}`
    );
    const request2 = authAxios().get(
      `/hairshop/closed-day/${localStorage.getItem('shop_seq')}`
    );

    const calendar = calendarRef.current.getApi();
    calendar.setOption('plugins', [dayGridPlugin]);
    calendar.setOption('initialView', 'dayGridMonth');

    // Axios.all 메소드를 사용하여 여러 개의 요청을 동시에 보냄
    axios
      .all([request1, request2])
      .then(
        axios.spread((res1, res2) => {
          console.log('Response from request1:', res1.data);
          console.log('Response from request2:', res2.data);
          // 각각의 응답에 대한 처리

          const eventList = res2.data.map((item) => ({
            title: `${item.staff_nickname || '전체 휴무'}: ${item.temp_memo}`,
            // title: `${item.staff_nickname} ? '전체 휴무' : ${item.staff_nickname}}`,
            start: `${item.temp_start}T00:00:00`,
            end: `${item.temp_end}T23:59:59`,
            description: item.temp_memo,
          }));

          setReservation(res1.data);
          setClosedDay(res2.data);
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
          <h3>24</h3>
        </div>
        <div className={`${styles.item} card`}>
          <h4>예약취소</h4>
          <h3>2</h3>
        </div>
        <div className={`${styles.item} card`}>
          <h4>노쇼</h4>
          <h3>2</h3>
        </div>
        <div className={`${styles.item} card`}>
          <h4>금월 매출</h4>
          <h3>4</h3>
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
                header='담당 디자이너'
                className='text-center'
              />
              <Column
                field='cust_name'
                header='고객 이름'
                className='text-center font-semibold'
              />
              <Column
                field='reserv_time'
                header='예약시간'
                className='text-center'
                body={reservationTimeTemplate}
              />
              <Column
                field='reserv_request'
                header='예약 정보'
                body={reservationInfoTemplate}
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
            <span>
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
            그래프 하나 있으면 이쁠 듯
          </h2>
          <div>
            <DashboardChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
