import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import MyCalendar from 'service/MyCalender';
import axios from 'axios';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import callAxios from 'service/CallAxios';
import { InputText } from 'primereact/inputtext';

function ClosedDay() {
  const [dates, setDates] = useState(null);
  const [parsedDate, setParsedDate] = useState(null);
  const [staffName, setStaffName] = useState(null);

  const defaultValues = {
    title: '',
    dates: '',
  };

  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    setValue('title', data.title);
    setValue('dates', data.dates);

    const startDate = new Date(data.dates[0]);
    const endDate = new Date(data.dates[1]);

    const parsedStartDate = `${startDate.getFullYear()}-${(
      startDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

    const parsedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

    setParsedDate({ parsedStartDate, parsedEndDate });
    setStaffName(data.title);
  };

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

      setParsedDate({ parsedStartDate, parsedEndDate });
      setStaffName('미용실 임시 휴무');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                onChange={(e) => e.value && setDates(e.value)}
                selectionMode='range'
                readOnlyInput
              />
              <Button
                type='button'
                label='제출'
                onClick={checkDate}
              />
            </div>
          </Panel>
          <Panel
            toggleable
            header='직원 임시 휴무일'
          >
            <div className='card'>
              <Controller
                name='title'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      value={field.value || ''}
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                    />
                  </>
                )}
              />

              <Controller
                name='dates'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      id={field.name}
                      value={field.value || ''}
                      selectionMode='range'
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={field.onChange}
                    />
                    <Button
                      type='submit'
                      label='제출'
                    />
                  </>
                )}
              />
            </div>
          </Panel>
        </div>
        <div className='col-6'>
          <MyCalendar
            parsedDate={parsedDate}
            staffName={staffName}
          />
        </div>
      </div>
    </form>
  );
}

export default ClosedDay;
