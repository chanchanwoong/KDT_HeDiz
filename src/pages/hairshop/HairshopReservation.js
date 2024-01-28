import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { Link, useLocation } from 'react-router-dom';
import { authAxios } from 'api/AxiosAPI';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import axios from 'axios';
import { generateDates, generateTimeSlots, getToday, getCurrnetTime } from 'components/common/GenerateTime';
import { useRecoilValue } from 'recoil';
import { custLevelState } from 'api/Recoil';

function HairshopReservation() {
  const location = useLocation();
  ///////// 결제 페이지에 필요한 데이터들
  const style_name = location.state.style_name;
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;
  const shop_name = location.state.shop_name;
  const style_price = location.state.style_price;
  const shop_start = location.state.shop_start;
  const shop_end = location.state.shop_end;

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [staff, setStaff] = useState([]);
  const [reserv, setReserv] = useState([]);
  const dates = generateDates();
  const [time, setTime] = useState([]);
  const [staffNickname, setStaffNickname] = useState('');
  const [staffSeq, setStaffSeq] = useState('');
  const [staffIndex, setStaffIndex] = useState();
  const custLevel = useRecoilValue(custLevelState);
  const discountedPrice = custLevel === 1 ? style_price * 0.9 : style_price;
  ///////////////////////////////////////    데이터 가져오기 (디자이너, 예약 가능 시간)
  ///////////////////////////////////////    StaffList 컴포넌트는 사용 X (코드 수정이 많음)
  useEffect(() => {
    const request1 = authAxios().get(`hairshop/${shop_seq}/staff`);
    const request2 = authAxios().get(`hairshop/reservation/${shop_seq}/${style_seq}/${selectedDate}`);

    axios
      .all([request1, request2])
      .then(
        axios.spread((res1, res2) => {
          console.log('Response from request1:', res1.data);
          console.log('Response from request2:', res2.data);
          //// res2.data는 다른 response와 다르게 JSON 형태로 값을 받아옴
          //// staff_seq : [가능한 시간]

          setStaff(res1.data);
          setReserv(res2.data);
          setStaffIndex(res1.data[0].staff_seq);
        })
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
  }, [selectedDate]);

  ///////////////////////////////////////    디자이너 리스트 생성부분
  ///////////////////////////////////////    시간 버튼을 생성시켜주는 components/common/GenerateTime.js 사용
  const itemTemplate = (staff, index, reserv) => {
    console.log(reserv);
    const curTime = getCurrnetTime();
    console.log(curTime);
    const today = getToday();
    return (
      <div
        className="col-12"
        key={staff.staff_seq}
      >
        <div
          className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', {
            'border-top-1 surface-border': index !== 0,
          })}
        >
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={staff.staff_image}
            alt={staff.staff_nickname}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{staff.staff_nickname}</div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <span className="font-semibold">{staff.staff_role}</span>
                </span>
              </div>
              <span>{staff.staff_intro}</span>
              <div className="time-buttons">
                {/* generateTimeSlots 함수를 이용하여 시간 버튼 생성
                    disable 조건 : reserv 안에 없는 시간이 버튼 에 포함 되는 경우,
                                  오늘 날짜의 현재 시간이 지나면 예약 불가능       
                    generateTimeSlots : 가게 오픈시간과 마감시간을 전달받아서 timeSlot이라는 배열에 넣음
                    그 후 map함수로 timeSlot을 돌면서 버튼을 생성 */}
                {generateTimeSlots(shop_start, shop_end).map((timeSlot) => (
                  <button
                    key={timeSlot.key}
                    className="btn btn-primary"
                    onClick={() => handleTimeButtonClick(timeSlot.key, reserv, staff.staff_seq, staff.staff_nickname)}
                    disabled={
                      !reserv?.includes(timeSlot.key) || (timeSlot.key < curTime && selectedDate.includes(today))
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
  ///////////////////////////////////////   itemTemplate를 갯수만큼 반복
  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    /// 초기에 staff_seq 를 받아와 key값 첫번째에 저장해서 값을 읽어옴 (JSON 형태이기 때문에 staff_seq = key 값)
    let list = items.map((product, index) => {
      return itemTemplate(product, index, reserv[staffIndex]);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  // 클릭한 시간 값을 받아오는 함수
  const handleTimeButtonClick = (selectedTime, reservTime, staff_seq, staff_nickname) => {
    // 선택한 시간에 대한 처리를 수행, time에 현재시간, staff_nickname staff_seq 를 저장
    console.log('reservTime:', reservTime);
    console.log('Selected time:', selectedTime);
    console.log(staff_nickname);
    setTime(selectedTime);
    setStaffNickname(staff_nickname);
    setStaffSeq(staff_seq);
  };

  return (
    <div>
      <Panel header="예약하기">
        <div className="flex flex-column">
          <span>매장이름: {shop_name}</span>
          <span>선택한 스타일: {style_name}</span>
          <span>가격 : {style_price} 원</span>
        </div>
      </Panel>
      <Panel header="날짜선택">
        <div>
          {/* dates : generateDates() 함수 호출. 오늘 날짜를 기준으로 2주간의 년-월-일 리턴
                      map 함수로 반복문을 돌면서 2주간의 날짜 버튼 생성*/}
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={{
                marginRight: '10px',
                marginBottom: '10px',
                background: selectedDate === date ? 'blue' : 'gray',
                color: 'white',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              {date}
            </button>
          ))}
        </div>
      </Panel>
      <Panel header="스타일리스트">
        <div className="card">
          <DataView
            value={staff}
            listTemplate={listTemplate}
          />
        </div>
      </Panel>
      {/*url 이동할 때 state에 값을 저장하여 보내기, 결제 페이지에서 필요한 정보들 */}
      <Link
        to="/hairshop/payment"
        state={{
          cust_name: localStorage.getItem('cust_name'),
          reserv_date: selectedDate,
          reserv_time: time,
          shop_name: shop_name,
          staff_seq: staffSeq,
          staff_nickname: staffNickname,
          style_seq: style_seq,
          style_name: style_name,
          style_price: custLevel === 1 ? discountedPrice : style_price,
          shop_seq: shop_seq,
        }}
      >
        <Button>결제 화면으로</Button>
      </Link>
    </div>
  );
}

export default HairshopReservation;
