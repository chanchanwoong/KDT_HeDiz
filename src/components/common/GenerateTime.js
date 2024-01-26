///// 시작시간 끝 시간을 받아와서 30분 단위로 버튼 생성
export const generateTimeSlots = (shop_start, shop_end) => {
  const startTime = parseTimeToMinutes(shop_start); // shop_start 값을 파싱하여 분 단위로 변환합니다.
  const endTime = parseTimeToMinutes(shop_end); // 18:00 in minutes
  const interval = 30; // 30 minutes interval
  console.log(shop_start, shop_end);
  console.log(startTime, endTime);

  let timeSlots = [];
  for (let time = startTime; time < endTime; time += interval) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:00`;

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

///// 오늘 날짜를 기준으로 2주간의 년-월-일 리턴 (예약페이지에서 사용)
export const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

////// 가게 영업시간을 분으로 변환 시키기 위한 함수
const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':');
  return parseInt(hours) * 60 + parseInt(minutes);
};

////// 오늘과 시간 구하는 함수
export function todayTime() {
  let date = new Date();
  console.log(date);
  let year = date.getFullYear(); //년도 구하기
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;
  second = second >= 10 ? second : '0' + second;
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}
