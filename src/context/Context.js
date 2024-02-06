import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';

const DataLengthContext = createContext();

export const DataLengthProvider = ({ children }) => {
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    authAxios()
      .get(`/home/realtime-reservation/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        setDataLength(response.data.length);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  return (
    <DataLengthContext.Provider value={{ dataLength, setDataLength }}>
      {children}
    </DataLengthContext.Provider>
  );
};

export const useDataLength = () => {
  return useContext(DataLengthContext);
};
