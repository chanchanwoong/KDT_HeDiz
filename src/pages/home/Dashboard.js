import React, { useState, useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';
import Clock from 'react-live-clock';
import { formatTime } from 'service/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { authAxios } from 'api/AxiosAPI';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Dashboard() {
  const [reservation, setReservation] = useState([]);
  const calendarRef = useRef(null);

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
    authAxios()
      .get(`/home/realtime-reservation/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  useEffect(() => {
    const calendar = calendarRef.current.getApi();

    // FullCalendar 설정
    calendar.setOption('plugins', [dayGridPlugin]);
    calendar.setOption('initialView', 'dayGridMonth');
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
            <span>휴무일</span>
            <span>
              <span className='mr-1 text-primary text-semiblod'>월요일</span>
              정기 휴무
            </span>
          </h2>
          <div>
            <FullCalendar
              locale='kr'
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView='dayGridMonth'
            />
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
            <span>고객 방문 현황</span>
            그래프 하나 있으면 이쁠 듯
          </h2>
          <div>매출 요약 그래프 또는 금주 고객 방문 횟수?</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
