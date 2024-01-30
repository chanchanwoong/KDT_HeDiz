import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReservationContext } from 'context/ReservationContext';
import axios from 'axios';
import { authAxios } from 'api/AxiosAPI';
import {
  formatHourMinute,
  formatNumberWithCommas,
  formatDate,
} from 'utils/util';
import {
  generateDates,
  generateTimeSlots,
  getToday,
  getCurrnetTime,
} from 'utils/GenerateTime';
import { Panel } from 'primereact/panel';
import { DataView } from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

function Schedule() {
  // 결제 페이지로 이동할 때 필요한 데이터
  const { setCustSeq, setStyleSeq, setStaffSeq, setShopSeq, setDate, setTime } =
    useReservationContext();

  const location = useLocation();
  const navigate = useNavigate();

  // 예약 진행 중인 cust_seq, shop_seq, style_seq
  const searchParams = new URLSearchParams(location.search);
  const shopSeq = searchParams.get('hairshop');
  const styleSeq = searchParams.get('hairstyle');
  setCustSeq(localStorage.getItem('cust_seq'));
  setShopSeq(shopSeq);
  setStyleSeq(styleSeq);

  // 헤어샵, 헤어스타일, 직원, 선택 날짜 데이터
  const [hairshop, setHairshop] = useState([]);
  const [hairstyle, setHairstyle] = useState([]);
  const [staff, setStaff] = useState([]);
  const [staffIndex, setStaffIndex] = useState();
  const [selectedDate, setSelectedDate] = useState(getToday());

  // 고객이 선택한 직원, 예약날짜, 예약시간
  const [selectStaffSeq, setSelectStaffSeq] = useState('');
  const [staffNickname, setStaffNickname] = useState('');
  const [reservDate, setReservDate] = useState('');
  const [reservTime, setReservTime] = useState('');
  const dates = generateDates();

  // 버튼 활성화
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  // 예약 확인 창
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const hairshopRequest = authAxios().get(`hairshop/${shopSeq}`);
    const hairstyleReqeust = authAxios().get(
      `/hairshop/${shopSeq}/hairstyle/${styleSeq}`
    );
    const staffRequest = authAxios().get(`hairshop/${shopSeq}/staff`);
    const reservDateRequest = authAxios().get(
      `hairshop/reservation/${shopSeq}/${styleSeq}/${selectedDate}`
    );
    console.log(reservDateRequest);

    axios
      .all([hairshopRequest, hairstyleReqeust, staffRequest, reservDateRequest])
      .then(
        axios.spread(
          (
            hairshopRequest,
            hairstyleReqeust,
            staffRequest,
            reservDateRequest
          ) => {
            console.log('hairshopRequest:', hairshopRequest.data);
            console.log('hairstyleReqeust:', hairstyleReqeust.data);
            console.log('staffRequest:', staffRequest.data);
            console.log('reservDateRequest:', reservDateRequest.data);
            //// res2.data는 다른 response와 다르게 JSON 형태로 값을 받아옴
            //// staff_seq : [가능한 시간]
            setHairshop(hairshopRequest.data);
            setHairstyle(hairstyleReqeust.data);
            setStaff(staffRequest.data);
            setStaffIndex(staffRequest.data[0].staff_seq);
            setReservDate(reservDateRequest.data);
          }
        )
      )
      .catch((error) => {
        console.error('Error in Axios.all:', error);
      });
    setIsButtonEnabled(selectedDate && reservTime);
  }, [selectedDate, reservTime]);

  const itemTemplate = (staff, index, reserv) => {
    const curTime = getCurrnetTime();
    const today = getToday();

    return (
      <article key={staff.staff_seq}>
        <div className='flex align-items-center gap-2 mb-4'>
          {/* <img
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={staff.staff_image}
            alt={staff.staff_nickname}
          /> */}
          <Avatar
            image='https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
            className='mr-2'
            size='xlarge'
            shape='circle'
          />
          <div>
            <p className='m-0'>
              <span className='font-bold mr-2'>{staff.staff_nickname}</span>
              <span>{staff.staff_role}</span>
            </p>
            <p className='m-0 text-color-secondary text-sm'>
              {staff.staff_intro}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap justify-content-start gap-1'>
          {/* generateTimeSlots 함수를 이용하여 시간 버튼 생성
                    disable 조건 : reserv 안에 없는 시간이 버튼 에 포함 되는 경우,
                                  오늘 날짜의 현재 시간이 지나면 예약 불가능       
                    generateTimeSlots : 가게 오픈시간과 마감시간을 전달받아서 timeSlot이라는 배열에 넣음
                    그 후 map함수로 timeSlot을 돌면서 버튼을 생성 */}
          {generateTimeSlots(hairshop.shop_start, hairshop.shop_end).map(
            (timeSlot) => (
              <Button
                key={timeSlot.key}
                size='small'
                severity='secondary'
                className='btn__time'
                onClick={() =>
                  handleTimeButtonClick(
                    timeSlot.key,
                    reserv,
                    staff.staff_seq,
                    staff.staff_nickname
                  )
                }
                disabled={
                  !reserv?.includes(timeSlot.key) ||
                  (timeSlot.key < curTime && selectedDate.includes(today))
                }
              >
                {formatHourMinute(timeSlot.props.children)}
              </Button>
            )
          )}
          <Divider />
        </div>
      </article>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;
    const staffSeqList = staff.map((staff) => staff.staff_seq);
    let list = items.map((product, index) => {
      const staffSeq = staffSeqList[index];
      const reservDateForStaff = reservDate[staffSeq];
      return itemTemplate(product, index, reservDateForStaff);
    });
    return <div className='grid grid-nogutter'>{list}</div>;
  };

  // 클릭한 시간 값을 받아오는 함수
  const handleTimeButtonClick = (
    selectedTime,
    reservTime,
    staff_seq,
    staff_nickname
  ) => {
    // 선택한 시간에 대한 처리를 수행, time에 현재시간, staff_nickname staff_seq 를 저장
    console.log('Selected time:', selectedTime);
    console.log(staff_seq);
    console.log(staff_nickname);
    setReservTime(selectedTime);
    setStaffNickname(staff_nickname);
    setSelectStaffSeq(staff_seq);
  };

  const handleButtonClick = () => {
    if (selectedDate && reservTime) {
      setConfirmVisible(true);
      setDate(selectedDate);
      setTime(reservTime);
      setStaffSeq(selectStaffSeq);
    }
  };

  const confirmHeader = (
    <div className='flex align-items-center gap-2'>
      <span className='font-bold'>예약 정보를 확인해주세요</span>
    </div>
  );

  return (
    <>
      <Panel
        header='날짜 선택'
        className='mb-4'
      >
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
              {formatDate(date)}
            </button>
          ))}
        </div>
      </Panel>

      <Panel header='시간 선택'>
        <div className='card'>
          <DataView
            value={staff}
            listTemplate={listTemplate}
          />
        </div>
      </Panel>
      <Button
        label={`${formatDate(selectedDate)} ${formatHourMinute(
          reservTime
        )} 선택완료`}
        className='btn__submit'
        disabled={!isButtonEnabled}
        onClick={handleButtonClick}
      />

      {/* 예약 정보 확인 창 */}
      <Sidebar
        visible={confirmVisible}
        position='bottom'
        header={confirmHeader}
        onHide={() => setConfirmVisible(false)}
        className='sidebar__reservation'
      >
        <Panel header='예약 정보'>
          <ul className='flex flex-column gap-2'>
            <li>
              <b>매장</b> {hairstyle.shop_name}
            </li>
            <li>
              <b>담당</b> {staffNickname}
            </li>
            <li>
              <b>메뉴</b> {hairstyle.style_name}
            </li>
            <li>
              <b>가격</b> {formatNumberWithCommas(hairstyle.style_price)}
            </li>
            <li>
              <b>예약</b> {selectedDate} {formatHourMinute(reservTime)}
            </li>
          </ul>
        </Panel>
        <div className='flex align-items-center justify-content-between gap-4 mt-4'>
          <Button
            label='다시선택'
            outlined
            className='w-full'
            // size='small'
            onClick={() => setConfirmVisible(false)}
          />
          <Button
            label='결제하기'
            // size='small'
            className='w-full'
            onClick={() => navigate(`/payment`)}
          />
        </div>
      </Sidebar>
    </>
  );
}

export default Schedule;
