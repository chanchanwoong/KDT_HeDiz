import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { useForm, Controller } from 'react-hook-form';
import { formatDate } from 'service/Utils';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { classNames } from 'primereact/utils';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';

function ClosedDay() {
  const [staff, setStaff] = useState(null);
  const [closedDay, setClosdedDay] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const toast = useRef(null);

  const defaultValues = {
    date: '',
    temp_memo: '',
    staff_seq: '',
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
  });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name].message}</small>
    ) : (
      ''
    );
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: '성공적으로 추가했습니다.',
      life: 3000,
    });
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: '실패했습니다.',
      life: 3000,
    });
  };

  const updateCalendarEvents = () => {
    authAxios()
      .get(`/hairshop/closed-day/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setClosdedDay(response.data);

        // 이벤트 데이터 생성
        const eventList = response.data.map((item) => ({
          title: `${item.staff_nickname || '전체 휴무'}: ${item.temp_memo}`,
          // title: `${item.staff_nickname} ? '전체 휴무' : ${item.staff_nickname}}`,
          start: `${item.temp_start}T00:00:00`,
          end: `${item.temp_end}T23:59:59`,
          description: item.temp_memo,
        }));

        const regularDays =
          response.data[0]?.shop_regular.split(',').map(Number) || [];

        // 요일 데이터 매핑
        const daysMapping = [
          { label: '휴무일 없음', value: '0' },
          { label: '일요일', value: '1' },
          { label: '월요일', value: '2' },
          { label: '화요일', value: '3' },
          { label: '수요일', value: '4' },
          { label: '목요일', value: '5' },
          { label: '금요일', value: '6' },
          { label: '토요일', value: '7' },
        ];

        // 매주 정기 휴무일을 표현하는 반복 이벤트 생성
        const recurringEvents = regularDays.map((day) => ({
          title: '정기 휴무일',
          daysOfWeek: [day - 1],
          editable: false,
          backgroundColor: 'rgb(100 117 139)',
        }));

        // 기존 이벤트와 매주 정기 휴무일을 합침
        const combinedEvents = [...eventList, ...recurringEvents];
        // FullCalendar에 이벤트 설정
        setEvents(combinedEvents);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  useEffect(() => {
    const calendar = calendarRef.current.getApi();

    // FullCalendar 설정
    calendar.setOption('plugins', [dayGridPlugin, timeGridPlugin]);
    calendar.setOption('initialView', 'timeGridWeek');

    updateCalendarEvents();

    authAxios()
      .get(`/hairshop/staff/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setStaff(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  // [POST] 임시 휴무일 추가
  const onSubmit = (data) => {
    console.log(data);

    const reqeustData = {
      shop_seq: localStorage.getItem('shop_seq'),
      temp_start: formatDate(data.date[0]),
      temp_end: formatDate(data.date[1]),
      temp_memo: data.temp_memo,
      staff_seq: data.temp_staff.staff_seq,
    };
    console.log('Auth Request:', reqeustData);

    authAxios()
      .post('/hairshop/closed-day/', reqeustData)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: `${response.data.staff_nickname}: ${response.data.temp_memo}`,
            start: `${response.data.temp_start}`,
            end: `${response.data.temp_end}`,
            description: response.data.temp_memo,
          },
        ]);
        updateCalendarEvents();
        showSuccess();
        reset();
      })
      .catch((error) => {
        console.error('Auth Error:', error);
        showError();
      });
  };

  return (
    <>
      <div className='card h-full'>
        <h2 className='flex align-items-center justify-content-between'>
          <span>임시 휴무일</span>
        </h2>

        <div className='flex'>
          <div className='col-8'>
            <FullCalendar
              locale='kr'
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView='dayGridMonth'
              events={events}
            />
          </div>
          <div className='col-4'>
            <Panel
              header='임시 휴무일 추가'
              className='mb-3'
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-wrap flex-column gap-4 p-fluid'
              >
                <div className='flex-auto'>
                  <label
                    htmlFor='buttondisplay'
                    className='font-bold block mb-2'
                  >
                    직원
                  </label>
                  <Controller
                    name='temp_staff'
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          name='staff_seq'
                          id={field.name}
                          {...field}
                          options={staff}
                          optionLabel='staff_nickname'
                          placeholder='직원을 선택해주세요'
                          disabled={checked} // 전체 휴무일 경우 Dropdown 비활성화
                        />
                        {getFormErrorMessage(field.name)}
                        <div className='flex align-items-center mt-2'>
                          <Checkbox
                            onChange={(e) => {
                              setChecked(e.checked);
                              field.onChange(checked ? null : undefined);
                            }}
                            checked={checked}
                          />
                          <label
                            htmlFor='ingredient1'
                            className='ml-2'
                          >
                            전체 휴무
                          </label>
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className='flex-auto'>
                  <label
                    htmlFor='buttondisplay'
                    className='font-bold block mb-2'
                  >
                    날짜 선택
                  </label>
                  <Controller
                    name='date'
                    control={control}
                    rules={{ required: '필수 입력 항목입니다' }}
                    render={({ field, fieldState }) => (
                      <>
                        <Calendar
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='날짜를 선택해주세요'
                          dateFormat='yy/mm/dd'
                          minDate={new Date()}
                          selectionMode='range'
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
                <div className='flex-auto'>
                  <label
                    htmlFor='buttondisplay'
                    className='font-bold block mb-2'
                  >
                    메모
                  </label>
                  <Controller
                    name='temp_memo'
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          id={field.name}
                          {...field}
                          placeholder='휴무에 대한 메모를 남겨주세요'
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
                <Toast ref={toast} />
                <Button
                  type='submit'
                  label='추가하기'
                />
              </form>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClosedDay;
