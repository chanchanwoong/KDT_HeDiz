export function getReservationValue(status) {
  switch (status) {
    case 0:
      return { value: '예약 완료', severity: 'success', color: '#049bff' };
    case 1:
      return { value: '방문 완료', severity: 'danger', color: '#8b5cf6' };
    case 2:
      return { value: '예약 취소', severity: 'info', color: '#ffaa00' };
    case 3:
      return { value: '노쇼', severity: 'danger', color: '#ff416a' };
    case 4:
      return { value: '대기', severity: 'danger', color: '#76818d' };
    default:
      return { value: '', severity: null };
  }
}

export function getReservationStatus(status) {
  switch (status) {
    case 1:
      return { value: '방문 완료', severity: 'danger', color: '#4cc0c0' };
    case 3:
      return { value: '노쇼', severity: 'danger', color: '#ff416a' };
    default:
      return { value: '', severity: null };
  }
}

export function getReservationValueReturn(status) {
  switch (status) {
    case '예약 완료':
      return { value: 0, severity: 'success', color: '#049bff' };
    case '방문 완료':
      return { value: 1, severity: 'danger', color: '#4cc0c0' };
    case '예약 취소':
      return { value: 2, severity: 'info', color: '#ff9e40' };
    case '노쇼':
      return { value: 3, severity: 'danger', color: '#ff416a' };
    case '대기':
      return { value: 4, severity: 'danger', color: '#ffcd56' };
    default:
      return { value: '', severity: null };
  }
}
