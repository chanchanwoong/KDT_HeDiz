export const generateTimeSlots = () => {
  const startTime = 9 * 60; // 9:00 in minutes
  const endTime = 18 * 60; // 18:00 in minutes
  const interval = 30; // 30 minutes interval

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
        // disabled={reserv.includes(formattedTime)}
      >
        {formattedTime}
      </button>
    );
  }
  return timeSlots;
};

export const generateDates = () => {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
