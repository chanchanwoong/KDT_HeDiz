import { createContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReservationContext } from 'context/ReservationContext';
import axios from 'axios';
import { authAxios } from 'api/AxiosAPI';
import {
  formatHourMinute,
  formatNumberWithCommas,
  formatDate,
  formatCalendarDate,
} from 'utils/util';
import {
  generateDates,
  generateTimeSlots,
  getToday,
  getCurrnetTime,
} from 'utils/GenerateTime';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { DataView } from 'primereact/dataview';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { requestPermission } from 'api/firebase-messaging-sw';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';

function Schedule() {
  // 결제 페이지로 이동할 때 필요한 데이터
  const { setCustSeq, setStyleSeq, setStaffSeq, setShopSeq, setDate, setTime } =
    useReservationContext();

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);

  // 예약 진행 중인 cust_seq, shop_seq, style_seq
  const searchParams = new URLSearchParams(location.search);
  const custSeq = localStorage.getItem('cust_seq');
  const shopSeq = searchParams.get('hairshop');
  const styleSeq = searchParams.get('hairstyle');
  setCustSeq(custSeq);
  setShopSeq(shopSeq);
  setStyleSeq(styleSeq);

  // 헤어샵, 헤어스타일, 직원, 선택 날짜 데이터
  const [hairshop, setHairshop] = useState([]);
  const [hairstyle, setHairstyle] = useState([]);
  const [staff, setStaff] = useState([]);
  const [staffIndex, setStaffIndex] = useState();
  const [selectedDate, setSelectedDate] = useState(getToday());

  // const [selectedDate, setSelectedDate] = useState(getToday());

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
  // 대기인지 예약인지 체크
  const [isWait, setIsWait] = useState(false);
  // 폐점시간부터 스타일 소요시간 구하기
  const countCloseTime = (time) => {
    const styleTime = time; // hairstyle.style_time 값으로 대체해야 합니다.
    const [hours, minutes, seconds] = styleTime.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const dividedMinutes = totalMinutes / 30 - 1;
    return dividedMinutes;
  };
  // 대기버튼 눌렀을 때 나오는 창
  const showAccept = () => {
    toast.current.show({
      severity: 'success',
      summary: '대기 신청 성공',
      detail: '대기 신청이 완료되었습니다. 홈 화면으로 돌아갑니다.',
      life: 3000,
    });

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: '대기 신청 실패',
      detail: '대기 신청이 중복입니다.',
      life: 3000,
    });
  };
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
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block border-round'
            src={staff.staff_image}
            alt={staff.staff_nickname}
          /> */}
          <Avatar
            icon='pi pi-user'
            className='mr-2 '
            size='large'
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
          {!reserv ? (
            <p className='font-semibold'>미용실 임시 휴일</p>
          ) : (
            generateTimeSlots(hairshop.shop_start, hairshop.shop_end).map(
              (timeSlot, index) => (
                <div
                  key={timeSlot.key}
                  className='time-slot-wrapper'
                >
                  {reserv?.includes(timeSlot.key) &&
                  !(timeSlot.key < curTime && selectedDate.includes(today)) ? (
                    <Button
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
                    >
                      {formatHourMinute(timeSlot.props.children)}
                    </Button>
                  ) : (
                    <Button
                      size='small'
                      severity='secondary'
                      className='btn__time'
                      style={{ backgroundColor: '#ff7a7a' }}
                      disabled={
                        reserv?.length !== 0
                          ? index >=
                              generateTimeSlots(
                                hairshop.shop_start,
                                hairshop.shop_end
                              ).length -
                                countCloseTime(hairstyle.style_time) ||
                            (timeSlot.key < curTime &&
                              selectedDate.includes(today))
                          : true
                      }
                      onClick={() =>
                        handleWaitButtonClick(
                          timeSlot.key,
                          reserv,
                          staff.staff_seq,
                          staff.staff_nickname
                        )
                      }
                    >
                      {formatHourMinute(timeSlot.props.children)}
                    </Button>
                  )}
                </div>
              )
            )
          )}
        </div>

        <Divider />
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
    setIsWait(false);
  };
  /// 대기 시간을 클릭했을 때 isWait를 true로 설정하여 대기를 판별
  const handleWaitButtonClick = (
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
    setIsWait(true);
  };

  const handleButtonClick = () => {
    if (selectedDate && reservTime) {
      setConfirmVisible(true);
      setDate(selectedDate);
      setTime(reservTime);
      setStaffSeq(selectStaffSeq);
    }
  };
  //// 대기 버튼을 눌렀을 때 요청하는 axios
  const handlerWait = () => {
    let waitInfo = {
      cust_seq: custSeq,
      staff_seq: selectStaffSeq,
      style_seq: styleSeq,
      reserv_date: selectedDate,
      reserv_time: reservTime,
      reserv_request: null,
      reserv_stat: 4,
      receipt_id: null,
      ctoken_value: localStorage.getItem('firebasetoken'),
    };
    console.log(waitInfo);
    const response = authAxios()
      .post('/reservation', waitInfo)
      .then((response) => {
        console.log(response.data);
        console.log(response);
        if (response.data) {
          requestPermission();
          setConfirmVisible(false);
          showAccept();
        } else {
          showError();
        }
      })
      .catch((error) => {
        console.error('axios 요청 중 오류:', error);
        showError();
      });
  };
  const confirmHeader = !isWait ? (
    <div className='flex align-items-center gap-2'>
      <span className='font-bold'>예약 정보를 확인해주세요</span>
    </div>
  ) : (
    <div className='flex align-items-center gap-2'>
      <span className='font-bold'>대기 정보를 확인해주세요</span>
    </div>
  );

  return (
    <>
      <Calendar
        onChange={(e) => setSelectedDate(formatCalendarDate(e.value))}
        showIcon
        className='w-full mb-4'
        dateFormat='yy년 mm월 dd일'
        placeholder='날짜 선택'
        minDate={new Date()}
        maxDate={new Date(new Date().getTime() + 13 * 24 * 60 * 60 * 1000)}
      />
      {/* dates : generateDates() 함수 호출. 오늘 날짜를 기준으로 2주간의 년-월-일 리턴
                      map 함수로 반복문을 돌면서 2주간의 날짜 버튼 생성*/}

      <Panel header='시간 선택'>
        <div className='flex justify-content-end'>
          <div
            style={{
              backgroundColor: '#ff7a7a',
              padding: '5px',
              borderRadius: '5px',
              color: '#ffffff',
              fontSize: '10px',
              width: '50px',
              height: '25px',
            }}
          >
            대기 가능
          </div>
          <div
            style={{
              backgroundColor: '#64748B',
              padding: '5px',
              borderRadius: '5px',
              color: '#ffffff',
              fontSize: '10px',
              width: '50px',
              height: '25px',
              marginLeft: '10px',
              padding: '5px',
              borderRadius: '5px',
            }}
          >
            예약 가능
          </div>
        </div>

        <div className='card'>
          <DataView
            value={staff}
            listTemplate={listTemplate}
          />
        </div>
      </Panel>
      <Button
        label={
          isWait
            ? `${formatDate(selectedDate)} ${formatHourMinute(reservTime)} 대기`
            : `${formatDate(selectedDate)} ${formatHourMinute(
                reservTime
              )} 선택완료`
        }
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
        {!isWait ? (
          <Panel header='예약 정보'>
            <ul className='flex flex-column gap-3 text-sm'>
              <li>
                <b className='w-4 inline-block'>예약일자</b>{' '}
                {formatDate(selectedDate)} {formatHourMinute(reservTime)}
              </li>
              <li>
                <b className='w-4 inline-block'>미용실</b> {hairstyle.shop_name}
              </li>
              <li>
                <b className='w-4 inline-block'>담당 디자이너</b>{' '}
                {staffNickname}
              </li>
              <li>
                <b className='w-4 inline-block'>헤어스타일</b>{' '}
                {hairstyle.style_name}
              </li>
              <li>
                <b className='w-4 inline-block'>가격</b>{' '}
                {formatNumberWithCommas(hairstyle.style_price)}
              </li>
            </ul>
          </Panel>
        ) : (
          <Panel header='대기 정보'>
            <ul className='flex flex-column gap-3 text-sm'>
              <li>
                <b className='w-4 inline-block'>대기 일자</b>{' '}
                {formatDate(selectedDate)} {formatHourMinute(reservTime)}
              </li>
              <li>
                <b className='w-4 inline-block'>미용실</b> {hairstyle.shop_name}
              </li>
              <li>
                <b className='w-4 inline-block'>담당 디자이너</b>{' '}
                {staffNickname}
              </li>
              <li>
                <b className='w-4 inline-block'>헤어스타일</b>{' '}
                {hairstyle.style_name}
              </li>
            </ul>
          </Panel>
        )}

        <div className='btn__group gap-4 mt-4'>
          <div className='w-full flex align-items-center justify-content-between  gap-2'>
            <Button
              label='다시선택'
              outlined
              className='w-full'
              // size='small'
              onClick={() => setConfirmVisible(false)}
            />

            {!isWait ? (
              <Button
                label='결제하기'
                // size='small'
                className='w-full'
                onClick={() => navigate(`/payment`)}
              />
            ) : (
              <Button
                label='대기'
                // size='small'
                className='w-full'
                onClick={handlerWait}
              />
            )}
          </div>
        </div>
      </Sidebar>
      <Toast
        ref={toast}
        position='bottom-center'
      />
    </>
  );
}

export default Schedule;
