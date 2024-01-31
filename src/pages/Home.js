import { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { InputText } from 'primereact/inputtext';
import List from 'components/HairshopList';
function Home() {
  // 미용실 목록
  const [hairshopList, setHairshopList] = useState([]);
  const [filteredHairshopList, setFilteredHairshopList] = useState([]);

  // 미용실 검색
  const [hairshopFilterValue, setHairshopFilterValue] = useState('');

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setHairshopFilterValue(value);
  };

  useEffect(() => {
    authAxios()
      .get(`/`)
      .then((response) => {
        setHairshopList(response.data);
        setFilteredHairshopList(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  useEffect(() => {
    if (hairshopFilterValue.trim() !== '') {
      const filtered = hairshopList.filter((hairshop) =>
        hairshop.shop_name
          .toLowerCase()
          .includes(hairshopFilterValue.toLowerCase())
      );
      setFilteredHairshopList(filtered);
    } else {
      setFilteredHairshopList(hairshopList);
    }
  }, [hairshopFilterValue, hairshopList]);

  return (
    <>
      <p className='text-xl m-0 mb-4'>
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
        hairshopList={filteredHairshopList}
        hairshopName={hairshopFilterValue}
      />
    </>
  );
}

export default Home;
