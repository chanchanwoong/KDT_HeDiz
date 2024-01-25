export function getReservationValue(status) {
  switch (status) {
    case 0:
      return { value: '예약 완료', severity: 'success', color: '#049bff' };
    case 1:
      return { value: '방문 완료', severity: 'danger', color: '#4cc0c0' };
    case 2:
      return { value: '예약 취소', severity: 'info', color: '#ff9e40' };
    case 3:
      return { value: '노쇼', severity: 'danger', color: '#ff416a' };
    case 4:
      return { value: '대기', severity: 'danger', color: '#ffcd56' };
    default:
      return { value: '', severity: null };
  }
}
