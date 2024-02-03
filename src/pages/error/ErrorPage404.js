// NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage404 = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={{ marginRight: '20px' }}>
        <img
          src={process.env.PUBLIC_URL + '/logo512.png'}
          alt='Not Found'
          style={{ width: '200px', height: 'auto' }}
        />
      </div>
      <div>
        <h1>404 Not Found</h1>
        <p>존재하지 않는 페이지입니다. 밑의 버튼을 눌러 홈으로 이동해주세요.</p>
        <Link to='/'>홈으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default ErrorPage404;
