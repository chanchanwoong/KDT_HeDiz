import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import StaffList from '../../components/common/StaffList';
import { useLocation } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import axios from 'axios';

// 날짜를 'YYYY-MM-DD' 형식으로 포맷하는 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function HairshopReservation() {
  const location = useLocation();

  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  const style_time = location.state.style_time;
  const shop_name = location.state.shop_name;

  const [selectedDay, setSelectedDay] = useState(formatDate(new Date()));
  const [staff, setStaff] = useState([]);
  const [reservation, setReservation] = useState({}); // 빈 객체로 초기화

  useEffect(() => {
    const request1 = authAxios().get(`hairshop/staff/${shop_seq}`);
    const request2 = authAxios().get(
      `hairshop/reservation/${shop_seq}/${selectedDay}`
    );
    // Axios.all 메소드를 사용하여 여러 개의 요청을 동시에 보냄
    axios
      .all([request1, request2])
      .then(
        axios.spread((res1, res2) => {
          console.log('Response from request1:', res1.data);
          console.log('Response from request2:', res2.data);

          setStaff(res1.data);
          setReservation(res2.data);
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, [selectedDay]);

  const itemTemplate = (staff, index) => {
    return (
      <div
        className='col-12'
        key={staff.staff_seq}
      >
        <div
          className={classNames(
            'flex flex-column xl:flex-row xl:align-items-start p-4 gap-4',
            {
              'border-top-1 surface-border': index !== 0,
            }
          )}
        >
          <img
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={staff.staff_image}
            alt={staff.staff_nickname}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>
                {staff.staff_nickname}
              </div>

              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <span className='font-semibold'>{staff.staff_role}</span>
                </span>
              </div>
              <span>{staff.staff_intro}</span>
              <div className='time-buttons'>
                {generateTimeSlots().map((timeSlot) => (
                  <button
                    key={timeSlot.key}
                    className='btn btn-primary'
                    onClick={() => handleTimeButtonClick(timeSlot.key)}
                    disabled={
                      reservation.reserv_time || reservation.reserv_end_time
                    }
                  >
                    {timeSlot.props.children}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((staff, index) => {
      return itemTemplate(staff, index);
    });

    return <div className='grid grid-nogutter'>{list}</div>;
  };

  const generateTimeSlots = () => {
    const startTime = 9 * 60; // 9:00 in minutes
    const endTime = 18 * 60; // 18:00 in minutes
    const interval = 30; // 30 minutes interval

    let timeSlots = [];
    for (let time = startTime; time < endTime; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}`;

      timeSlots.push(
        <button
          key={formattedTime}
          className='btn btn-primary'
        >
          {formattedTime}
        </button>
      );
    }
    return timeSlots;
  };

  // 클릭한 시간 값을 받아오는 함수
  const handleTimeButtonClick = (selectedTime) => {
    // 선택한 시간에 대한 처리를 수행
    console.log('Selected time:', selectedTime);
  };

  // 2주 앞까지의 날짜를 계산하는 함수
  const calculateTwoWeeksAhead = () => {
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return formatDate(twoWeeksLater);
  };

  return (
    <div>
      <Panel header='예약하기'>
        <div className='flex flex-column'>
          <span>매장이름: {shop_name}</span>
          <span>선택한 스타일: {style_name}</span>
        </div>
      </Panel>
      <Panel header='날짜선택'>
        <input
          type='date'
          value={selectedDay}
          min={formatDate(new Date())} // 오늘 이후의 날짜만 선택 가능하도록
          max={calculateTwoWeeksAhead()} // 2주 앞까지의 날짜만 선택 가능하도록
          onChange={(e) => setSelectedDay(e.target.value)}
        />
      </Panel>
      <Panel header='스타일리스트'>
        <div className='card'>
          <DataView
            value={staff}
            listTemplate={listTemplate}
          />
        </div>
      </Panel>
    </div>
  );
}

export default HairshopReservation;
