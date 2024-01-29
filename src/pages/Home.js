import { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import List from 'components/HairshopList';
function Home() {
  // 미용실 목록
  const [hairshopList, setHairshopList] = useState([]);

  // 미용실 검색
  const [hairshopFilterValue, setHairshopFilterValue] = useState('');
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['name'].value = value;
    setFilters(_filters);
    setHairshopFilterValue(value);
  };

  useEffect(() => {
    authAxios()
      .get(`/`)
      .then((response) => {
        // console.log('Auth Response:', response.data);
        setHairshopList(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  return (
    <>
      <p className='text-xl m-0 mb-4'>
        {/* <p>{localStorage.getItem('cust_name')} 고객님 안녕하세요</p> */}
        <span className='p-input-icon-left w-full'>
          <i className='pi pi-search' />
          <InputText
            value={hairshopFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='미용실을 검색하세요'
            className='p-inputtext-sm'
          />
        </span>
      </p>
      {/* 미용실 목록 */}
      <List
        hairshopList={hairshopList}
        hairshopName={hairshopFilterValue}
      />
    </>
  );
}

export default Home;
