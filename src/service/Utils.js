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
