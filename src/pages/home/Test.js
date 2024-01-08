import { Form, redirect } from 'react-router-dom';

function Test() {
  return (
    <div>
      <h1>테스트 페이지</h1>
      <p>상호명</p>
      <hr />

      {/* 수정 부분 */}
      <Form method='put'>
        미용실 이름{' '}
        <input
          type='text'
          name='shop_name'
          defaultValue='다엘헤어 하단점'
          // disabled
        />
        <br />
        미용실 시퀀스{' '}
        <input
          type='text'
          name='shop_seq'
          defaultValue='1'
          // disabled
        />
        <br />
        사업자 등록번호{' '}
        <input
          type='text'
          name='shop_register'
          defaultValue='899-06-01226'
          //   disabled
        />
        <br />
        미용실 고유코드{' '}
        <input
          type='text'
          name='shop_code'
          defaultValue='testcode'
          // disabled
        />
        <br />
        <p>상호명 정보</p>
        <hr />
        정기 휴무{' '}
        <select name='shop_closeDay'>
          <option value='week'>매주</option>
          <option value='month'>매월</option>
        </select>
        <select name='shop_closeDay2'>
          <option>월</option>
          <option>화</option>
          <option>수</option>
          <option>목</option>
          <option>금</option>
          <option>토</option>
        </select>
        <br />
        주소{' '}
        <input
          type='text'
          name='shop_address'
          defaultValue='부산광역시 사하구 낙동남로 1419 (하단동) A동 2층'
        />{' '}
        <br />
        전화번호{' '}
        <input
          type='text'
          name='shop_phone'
          defaultValue='0507-1474-4560'
        />{' '}
        <br />
        미용실 소개{' '}
        <input
          type='text'
          name='shop_intro'
          defaultValue='다엘헤어가 정답입니다^^'
        />{' '}
        <br />
        영업 시작 시간{' '}
        <input
          type='text'
          name='shop_start'
          defaultValue='10:00:00'
        />{' '}
        <br />
        영업 종료 시간{' '}
        <input
          type='text'
          name='shop_end'
          defaultValue='21:30:00'
        />{' '}
        <br />
        {/* 미용실 해시태그{' '}
          <input
            type='text'
            name='tag'
          />{' '} */}
        <br />
        미용실 이미지 등록{' '}
        <input
          type='text'
          name='shop_image'
          defaultValue='img.jpg'
        />{' '}
        <br />
        <button type='submit'>수정하기</button>
      </Form>

      {/* ================================================================== */}
      {/* 추가 부분 */}
      <br />
      <hr />
      <hr />
      <br />

      <Form method='post'>
        미용실 이름{' '}
        <input
          type='text'
          name='shop_name'
          defaultValue='다엘헤어 하단점'
          // disabled
        />
        <br />
        미용실 시퀀스{' '}
        <input
          type='text'
          name='shop_seq'
          defaultValue='숫자만 넣으시오 (에러발생)'
          // disabled
        />
        <br />
        사업자 등록번호{' '}
        <input
          type='text'
          name='shop_register'
          defaultValue='넣지 마시오'
          //   disabled
        />
        <br />
        미용실 고유코드{' '}
        <input
          type='text'
          name='shop_code'
          defaultValue='넣지 마시오'
          // disabled
        />
        정기 휴무{' '}
        <select name='shop_closeDay'>
          <option value='week'>매주</option>
          <option value='month'>매월</option>
        </select>
        <select name='shop_closeDay2'>
          <option>월</option>
          <option>화</option>
          <option>수</option>
          <option>목</option>
          <option>금</option>
          <option>토</option>
        </select>
        <br />
        주소{' '}
        <input
          type='text'
          name='shop_address'
          defaultValue='부산광역시 사하구 낙동남로 1419 (하단동) A동 2층'
        />{' '}
        <br />
        전화번호{' '}
        <input
          type='text'
          name='shop_phone'
          defaultValue='0507-1474-4560'
        />{' '}
        <br />
        미용실 소개{' '}
        <input
          type='text'
          name='shop_intro'
          defaultValue='다엘헤어가 정답입니다^^'
        />{' '}
        <br />
        영업 시작 시간{' '}
        <input
          type='text'
          name='shop_start'
          defaultValue='10:00:00'
        />{' '}
        <br />
        영업 종료 시간{' '}
        <input
          type='text'
          name='shop_end'
          defaultValue='21:30:00'
        />{' '}
        <br />
        {/* 미용실 해시태그{' '}
          <input
            type='text'
            name='tag'
          />{' '} */}
        <br />
        미용실 이미지 등록{' '}
        <input
          type='text'
          name='shop_image'
          defaultValue='img.jpg'
        />{' '}
        <br />
        <button type='submit'>추가하기</button>
      </Form>

      {/* ================================================================== */}
      {/* 삭제 부분 */}
      <br />
      <hr />
      <hr />
      <br />

      <Form method='delete'>
        삭제할 미용실 시퀀스{' '}
        <input
          type='text'
          name='shop_seq'
          defaultValue='삭제할 시퀀스 입력'
          // disabled
        />
        <button type='submit'>삭제하기</button>
      </Form>

      {/* ================================================================== */}
      {/* 조회 부분 */}
      <br />
      <hr />
      <hr />
      <br />
      <Form method='post'>
        조회할 미용실 시퀀스{' '}
        <input
          type='text'
          name='shop_seq'
          defaultValue='조회할 시퀀스 입력'
          // disabled
        />
        <button type='submit'>조회하기</button>
      </Form>
    </div>
  );
}

export default Test;

// 수정
// export async function action({ request }) {
//   console.log('수정');
//   const formData = await request.formData();
//   const postData = Object.fromEntries(formData); // { body: '...', author: '...' }
//   console.log(postData);
//   await fetch('http://localhost:8080/hairshop/info', {
//     method: 'PUT',
//     body: JSON.stringify(postData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return redirect('/hairshop');
// }

// 추가
export async function action({ request }) {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData); // { body: '...', author: '...' }
  console.log(postData);
  await fetch('http://localhost:8080/hairshop/info', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return redirect('/hairshop');
}

// 삭제
// export async function action({ request }) {
//   const formData = await request.formData();
//   const postData = Object.fromEntries(formData); // { body: '...', author: '...' }
//   const shop_seq = postData.shop_seq;
//   console.log("shop_seq >>", shop_seq);
//   await fetch(`http://localhost:8080/hairshop/info/${shop_seq}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return redirect('/hairshop');
// }

// 조회
// export async function action({ request }) {
//   const formData = await request.formData();
//   const postData = Object.fromEntries(formData); // { body: '...', author: '...' }
//   const shop_seq = postData.shop_seq;
//   console.log('shop_seq >>', shop_seq);
//   await fetch(`http://localhost:8080/hairshop/info/${shop_seq}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return redirect('/hairshop');
// }
