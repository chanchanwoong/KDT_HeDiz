import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import HairshopList from '../../components/common/HairshopList';

function Home() {
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
    console.log(filters);
    console.log(value);
  };

  return (
    <>
      <p>cust_name 고객님 안녕하세요</p>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          value={hairshopFilterValue}
          onChange={onGlobalFilterChange}
          placeholder='미용실을 검색하세요'
        />
      </span>
      <HairshopList />
    </>
  );
}

export default Home;
