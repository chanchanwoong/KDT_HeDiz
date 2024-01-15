import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import MyCalendar from 'service/MyCalender';
import axios from 'axios';

function ClosedDay() {
  const [dates, setDates] = useState(null);
  const [parsedDate, setParsedDate] = useState(null);
  const [products, setProducts] = useState(null);

  function checkDate() {
    if (dates) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);

      const parsedStartDate = `${startDate.getFullYear()}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

      const parsedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

      console.log({ parsedStartDate, parsedEndDate });
      setParsedDate({ parsedStartDate, parsedEndDate });
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/staff')
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      <div className='flex col-12'>
        <div className='col-6'>
          <Panel
            toggleable
            header='미용실 임시 휴무일'
          >
            <div className='card flex flex justify-content-between flex-wrap align-items-center'>
              임시 휴무일
              <Calendar
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode='range'
                readOnlyInput
              />
              <Button
                type='submit'
                onClick={checkDate}
                label='Submit'
              />
            </div>
          </Panel>
          <Panel
            toggleable
            header='직원 임시 휴무일'
          >
            <div className='card'>
              <DataTable
                value={products}
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column
                  field='staff_nickname'
                  header='디자이너'
                ></Column>
                <Column
                  field='name'
                  header='휴무일'
                ></Column>
              </DataTable>
            </div>
          </Panel>
        </div>
        <div className='col-6'>
          <MyCalendar parsedDate={parsedDate} />
        </div>
      </div>
      <div className='col-6'></div>
    </>
  );
}

export default ClosedDay;
