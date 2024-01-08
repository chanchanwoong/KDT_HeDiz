import { useEffect, useState } from 'react';
import axios from 'axios';
import { BreadCrumb } from 'primereact/breadcrumb';

function Info() {
  const items = [{ label: '미용실 관리' }, { label: '미용실 정보' }];
  const home = { icon: 'pi pi-home', url: '/hairshop' };

  const [info, setInfo] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/hairshop/info/1')
      .then((res) => {
        console.log(res.data);
        setInfo(res.data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }, []);

  return (
    <>
      <BreadCrumb
        model={items}
        home={home}
      />
      <section>
        <ul>
          <li>미용실 이름: {info.shop_name}</li>
          <li>사업자 등록번호: {info.shop_register}</li>
          <li>미용실 고유코드: {info.shop_code}</li>
          <li>정기 휴무일: </li>
          <li>주소: {info.shop_name}</li>
          <li>전화번호: {info.shop_phone}</li>
          <li>미용실 소개: {info.shop_intro}</li>
          <li>
            영업 시간: {info.start} - {info.end}
          </li>
          <li>미용실 해시태그: </li>
        </ul>
      </section>
    </>
  );
}

export default Info;
