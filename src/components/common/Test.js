import React from 'react';
import { Button } from 'primereact/button';

const TimeButtons = ({ timeSlots }) => {
  return (
    <div>
      {timeSlots &&
        timeSlots.map((times, index) => (
          <div key={index}>
            {times.map((time) => (
              <Button
                key={time}
                time={time}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default TimeButtons;
