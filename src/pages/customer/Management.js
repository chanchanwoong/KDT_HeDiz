import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';

function Management() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    authAxios()
      .get(`/customer/total/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const checkGender = (rowData) => {
    const getGenderLabel = (gender) => {
      switch (gender) {
        case '1':
          return '남자';
        case '2':
          return '여자';
        default:
          return '';
      }
    };

    return getGenderLabel(rowData.cust_gender);
  };

  return (
    <Panel header='고객 방문 이력'>
      <div className='card'>
        <DataTable
          value={customers}
          paginator
          rows={10}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          rowsPerPageOptions={[10, 25, 50]}
        >
          <Column
            field='cust_name'
            header='고객 이름'
            style={{ minWidth: '14rem' }}
          />
          <Column
            field='cust_id'
            header='고객 아이디'
            sortable
            style={{ minWidth: '14rem' }}
          />
          <Column
            field='cust_phone'
            header='전화번호'
            sortable
            style={{ minWidth: '12rem' }}
          />

          {/* <Column
            field='cust_gender'
            header='성별'
            sortable
            style={{ minWidth: '12rem' }}
            body={checkGender()}
          /> */}
          {/* <Column
            field='cust_visit'
            header='방문횟수'
            sortable
            style={{ minWidth: '12rem' }}
          /> */}

          <Column
            field='stat_complete'
            header='정상 방문 횟수'
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field='stat_cancel'
            header='예약 취소 횟수'
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field='stat_noshow'
            header='노쇼 횟수'
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            // field='stat_noshow'
            header='전체 노쇼 횟수'
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            headerStyle={{ width: '5rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
          />
        </DataTable>
      </div>
    </Panel>
  );
}

export default Management;
