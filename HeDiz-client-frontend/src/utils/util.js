// 요일 포맷팅
export function getDayName(day) {
  const dayMappings = {
    0: '휴무일 없음',
    1: '일요일',
    2: '월요일',
    3: '화요일',
    4: '수요일',
    5: '목요일',
    6: '금요일',
    7: '토요일',
  };
  return dayMappings[day] || '알 수 없음';
}

// 예약상태
export function getReservationStat(stat) {
  const statMappings = {
    0: '예약 완료',
    1: '방문 완료',
    2: '예약 취소',
    3: '노쇼',
    4: '대기',
  };
  return statMappings[stat];
}

// 고객 등급
export function getCustomerLevel(level) {
  const levelMappings = {
    0: '일반 고객',
    1: 'VIP',
  };
  return levelMappings[level];
}

// 소수점 1까지 포맷
export function formatDecimal(value) {
  const floatValue = parseFloat(value) || 0;
  const formattedValue = floatValue.toFixed(1);

  return formattedValue;
}

// 숫자 000,000,000 형식으로 포맷
export function formatNumberWithCommas(value) {
  const parsedValue = parseFloat(value) || 0;
  const formattedValue = parsedValue.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedValue;
}

// 소요시간 포맷
export function formatTime(timeString) {
  if (!timeString) {
    return '시간 정보가 없습니다';
  }

  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours}시간`;
  }
  if (minutes > 0) {
    formattedTime += ` ${minutes}분`;
  }
  if (seconds > 0) {
    formattedTime += ` ${seconds}초`;
  }

  return formattedTime.trim();
}

// 시간 포맷
export function formatHourMinute(timeString) {
  if (!timeString) {
    return '';
  }

  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  let formattedTime = '';

  if (hours >= 0) {
    if (hours < 10) {
      formattedTime += `0${hours}시`;
    } else {
      formattedTime += `${hours}시`;
    }

    if (minutes === 0) {
      formattedTime += ` 00분`;
    } else if (minutes === 30) {
      formattedTime += ` 30분`;
    }
  }

  return formattedTime.trim();
}

export function formatDate(dateString) {
  const dateParts = dateString.split('-').map(Number);
  if (dateParts.length !== 3) {
    return '날짜 형식 오류';
  }

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  return `${year}년 ${month}월 ${day}일`;
}

export function formatCalendarDate(date) {
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
