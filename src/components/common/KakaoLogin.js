// Login.jsx
import React from 'react';
import img from '../../assets/kakao_login_large_wide.png';

function KakaoLogin() {
  const Rest_api_key = process.env.REACT_APP_KAKAO_REST_API_KEY; //REST API KEY
  const redirect_uri = 'http://localhost:3000/KakaoLoginResult'; //Redirect URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };
  return (
    <>
      <img
        src={img}
        onClick={handleLogin}
      ></img>
    </>
  );
}

export default KakaoLogin;
