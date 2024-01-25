// 날짜 데이터 포맷
// yyyy-MM-dd
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const [year, month, day] = new Date(dateString)
    .toLocaleDateString('ko-KR', options)
    .split('.')
    .map((part) => part.trim());

  return `${year}-${month}-${day}`;
};

// 시간 데이터 포맷
// (오전/오후) 00:00
export const formatTime = (timeString) => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };

  const formattedTime = new Date(`2022-01-01 ${timeString}`).toLocaleTimeString(
    'ko-KR',
    options
  );

  return formattedTime;
};

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
export function formatTimeTaken(timeString) {
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
