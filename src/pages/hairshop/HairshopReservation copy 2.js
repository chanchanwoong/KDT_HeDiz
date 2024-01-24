import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import BootpayAPI from '../../api/BootpayAPI';
import { useLocation } from 'react-router-dom';
import { authAxios } from '../../api/AxiosAPI';
import { Panel } from 'primereact/panel';
import StaffList from '../../components/common/StaffList';

function HairshopReservation() {
  const [info, setInfo] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reservation, setReservation] = useState([]);
  const location = useLocation();
  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  const [selectedDate, setSelectedDate] = useState(null);
  const [designerInfo, setDesignerInfo] = useState(null); // 디자이너 정보

  const reserv_time = '17:00:00';
  const style_time = '01:30:00';
  const shop_start = '09:00:00';
  const shop_end = '19:00:00';

  // 예약 가능한 시간대 계산
  const reservEndTime = new Date(`2022-01-01 ${reserv_time}`);
  reservEndTime.setSeconds(
    reservEndTime.getSeconds() + getTimeInSeconds(style_time)
  );

  const shopEndTime = new Date(`2022-01-01 ${shop_end}`);

  // 시간 버튼 비활성화
  const buttons = document.querySelectorAll('.time-button');

  buttons.forEach((button) => {
    const time = button.dataset.time;
    const buttonTime = new Date(`2022-01-01 ${time}`);

    if (buttonTime < reservEndTime || buttonTime > shopEndTime) {
      button.disabled = true;
    }
  });

  // style_time을 초로 변환하는 함수
  function getTimeInSeconds(time) {
    const [hours, minutes, seconds] = time.split(':');
    return (
      parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)
    );
  }
  useEffect(() => {
    authAxios()
      .get(`hairshop/staff/` + shop_seq)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setDesignerInfo(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  // 날짜 선택 ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const currentDate = new Date();
  const twoWeeksLater = new Date(
    currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  const handleDateClick = (date) => {
    setSelectedDate(date);

    authAxios()
      .get(`hairshop/reservation/${shop_seq}/${date}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setInfo(response.data);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  // 시간 버튼을 만들어주는 함수
  const renderTimeButtons = () => {
    const buttons = [];
    const currentTime = new Date();

    // 예약 가능한 시간대 계산
    const reservEndTime = new Date(`2022-01-01 ${reserv_time}`);
    reservEndTime.setSeconds(
      reservEndTime.getSeconds() + getTimeInSeconds(style_time)
    );

    // 시간 버튼 생성 및 예약 가능 여부 확인
    for (let i = 9; i <= 17; i++) {
      const time = `${i}:00:00`;
      const buttonTime = new Date(`2022-01-01 ${time}`);

      const isDisabled =
        buttonTime < reservEndTime ||
        buttonTime > shopEndTime ||
        isReserved(time);

      buttons.push(
        <button
          key={time}
          className='time-button'
          data-time={time}
          onClick={() => handleTimeClick(time)}
          disabled={isDisabled}
          style={{ marginRight: '10px', cursor: 'pointer' }}
        >
          {time}
        </button>
      );
    }

    return buttons;
  };

  // 예약이 있는 시간인지 확인하는 함수
  const isReserved = (time) => {
    return info.some(
      (reservation) =>
        reservation.staff_seq === designerInfo.staff_seq &&
        isTimeBetween(
          time,
          reservation.reserv_time,
          reservation.reserv_end_time
        )
    );
  };

  // 두 시간 사이에 주어진 시간이 있는지 확인하는 함수
  const isTimeBetween = (targetTime, startTime, endTime) => {
    return targetTime >= startTime && targetTime <= endTime;
  };

  const renderDateOptions = () => {
    const dates = [];
    let currentDate = new Date();

    while (currentDate <= twoWeeksLater) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map((date) => (
      <Button
        key={date}
        onClick={() => handleDateClick(date)}
        style={{
          display: 'inline-block',
          marginRight: '10px',
          border: selectedDate === date ? '1px solid blue' : '1px solid black',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        {date}
      </Button>
    ));
  };

  let payinfo = {
    style_name: style_name,
    style_price: 200,
  };

  const handleBootpay = async () => {
    console.log(payinfo);
    try {
      await BootpayAPI({ payinfo });
    } catch (error) {
      console.error('부트페이 API 호출 중 오류:', error);
    }
  };

  return (
    <div>
      <Panel header='예약하기'>
        <div>스타일 네임: {style_name}</div>
        <label htmlFor='dateSelect'>날짜 선택:</label>
        <div>{renderDateOptions()}</div>
        <div>
          <h4>예약 가능 시간:</h4>
          {renderTimeButtons()}
        </div>
      </Panel>

      <Panel header='스타일리스트'>
        <StaffList />
      </Panel>

      <Button onClick={handleBootpay}>결제 하기</Button>
    </div>
  );
}
export default HairshopReservation;
