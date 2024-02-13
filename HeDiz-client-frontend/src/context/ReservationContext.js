import React, { createContext, useState, useContext } from 'react';

const ReservationContext = createContext();

export const useReservationContext = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [custSeq, setCustSeq] = useState('');
  const [styleSeq, setStyleSeq] = useState('');
  const [staffSeq, setStaffSeq] = useState('');
  const [shopSeq, setShopSeq] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <ReservationContext.Provider
      value={{
        custSeq,
        setCustSeq,
        styleSeq,
        setStyleSeq,
        staffSeq,
        setStaffSeq,
        shopSeq,
        setShopSeq,
        date,
        setDate,
        time,
        setTime,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
