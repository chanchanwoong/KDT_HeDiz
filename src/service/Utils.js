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
export const formatTime = (dateString) => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return new Date(dateString).toLocaleTimeString('ko-KR', options);
};

const convertStringToDate = (dateString) => {
  // ISO 8601 형식인지 확인
  const isIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString);

  if (isIso8601) {
    // ISO 8601 형식인 경우, 그대로 Date 객체로 변환
    return new Date(dateString);
  } else {
    // 다른 형식인 경우, 적절한 포맷으로 조정 후 Date 객체로 변환
    const formattedDateString = adjustFormatIfNeeded(dateString);
    return new Date(formattedDateString);
  }
};
