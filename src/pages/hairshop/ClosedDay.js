import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProduectService';
import { Calendar } from 'primereact/calendar';
import MyCalendar from 'service/MyCalender';

function ClosedDay() {
  const [dates, setDates] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
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
              <Button label='Submit' />
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
                  field='code'
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
          <MyCalendar />
        </div>
      </div>
      <div className='col-6'></div>
    </>
  );
}

export default ClosedDay;
