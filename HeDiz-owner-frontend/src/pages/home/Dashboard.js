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
import DashboardBarChart from 'components/common/DashboardBarChart';
import DashboardLineChart from 'components/common/DashboardLineChart';
import { getReservationValue } from 'service/CommonOptions';
import { Tag } from 'primereact/tag';

function Dashboard() {
  const shopSeq = localStorage.getItem('shop_seq');
  const [reservation, setReservation] = useState([]);
  const [closedDay, setClosedDay] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  const [reservCount, setReservCount] = useState({});
  const [weekCount, setWeekCount] = useState([]);

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
    // tempday_shop tempday_staff 둘다 받아오기
    // 실시간 예약
    const realtimeRequest = authAxios().get(
      `/home/realtime-reservation/${shopSeq}`
    );
    // 휴무일
    const shopTempRequest = authAxios().get(
      `/hairshop/closed-day/shop/${shopSeq}`
    );
    const staffTempRequest = authAxios().get(
      `/hairshop/closed-day/staff/${shopSeq}`
    );

    // 금일 예약상태별 카운트 갯수
    const reservRequest = authAxios().get(`/home/dashboard/today/${shopSeq}`);
    // 최근 6개월 매출
    const summaryRequest = authAxios().get(
      `/home/dashboard/summary/${shopSeq}`
    );
    // 고객 방문현황
    // const weekRequest = authAxios().get(`/home/dashboard/week/${shopSeq}`);

    const calendar = calendarRef.current.getApi();
    calendar.setOption('plugins', [dayGridPlugin]);
    calendar.setOption('initialView', 'dayGridMonth');

    axios
      .all([
        realtimeRequest,
        shopTempRequest,
        staffTempRequest,
        reservRequest,
        summaryRequest,
        // weekRequest,
      ])
      .then(
        axios.spread((res1, res2, res3, res4, res5, res6) => {
          console.log('실시간 예약:', res1.data);
          console.log('미용실 휴무일:', res2.data);
          console.log('직원 휴무일:', res3.data);
          console.log('금일 예약 상태별 카운트:', res4.data);
          console.log('최근 6개월 매출:', res5.data);
          // console.log('고객 방문 현황:', res6.data);

          const combinedData = [...res2.data, ...res3.data];
          const eventList = combinedData.map((item) => ({
            title: `${item.staff_nickname ? item.staff_nickname : '전체 휴무'}`,
            start: `${item.temp_start}`,
            end: `${item.temp_end}`,
            backgroundColor: item.staff_nickname ? '#8b5cf6' : '#ffaa00',
          }));

          setReservation(res1.data);
          setClosedDay(combinedData);
          setEvents(eventList);

          setReservCount(res4.data);
          // setWeekCount(res6.data);
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, []);

  return (
    <>
      <div className={`${styles.container} dashboard`}>
        <div className={`${styles.item} card`}>
          <h4>금일 방문완료</h4>
          <p className={styles.title__value}>
            {reservCount?.[1]?.count}
            <span className='text-400 text-xl'>
              {' '}
              / {reservCount?.[0]?.count}
            </span>
          </p>
        </div>
        <div className={`${styles.item} card`}>
          <h4>금일 예약취소</h4>
          <p className={styles.title__value}>{reservCount?.[2]?.count}</p>
        </div>
        <div className={`${styles.item} card`}>
          <h4>금일 노쇼</h4>
          <p className={styles.title__value}>{reservCount?.[3]?.count}</p>
        </div>
        {/* <div className={`${styles.item} card`}>
          <h4>금월 매출</h4>
          <p className={styles.title__value}></p>
        </div> */}
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
              scrollHeight='860px'
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
            <span>월별 매출 요약</span>
          </h2>
          <div>
            <DashboardLineChart />
          </div>
        </div>
        <div
          className={`${styles.item} card flex flex-direction justify-content-between`}
        >
          <h2 className='flex align-items-center justify-content-between'>
            <span>휴무일</span>
            <span className='text-lg'>
              <span className='mr-1 text-primary text-semiblod'>월요일</span>
              정기 휴무
            </span>
          </h2>
          <FullCalendar
            locale='kr'
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView='dayGridMonth'
            events={events}
            headerToolbar={false}
            // height={520}
            height='100%'
          />
        </div>
        <div className={`${styles.item} card`}>
          <h2 className='flex align-items-center justify-content-between'>
            <span>일주일 고객 방문 현황</span>
          </h2>
          <div>
            <DashboardBarChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
