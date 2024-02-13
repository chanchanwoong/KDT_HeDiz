import React, { useEffect, useState } from 'react';
import axios from 'axios';

function KakaoLoginResult() {
  const PARAMS = new URL(document.location).searchParams;
  const KAKAO_CODE = PARAMS.get('code');
  const [accessTokenFetching, setAccessTokenFetching] = useState(false);

  console.log('KAKAO_CODE:', KAKAO_CODE);

  // Fetch Access Token
  const fetchAccessToken = async () => {
    if (accessTokenFetching) return;

    console.log('fetchAccessToken called');

    try {
      setAccessTokenFetching(true);

      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&code=${KAKAO_CODE}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );
      console.log('response >>>>> ', response);
      const accessToken = response.data.access_token;
      console.log('accessToken:', accessToken);
      localStorage.setItem('accessToken', accessToken);

      setAccessTokenFetching(false);
      fetchProfile();
    } catch (error) {
      console.error('Error:', error);
      setAccessTokenFetching(false);
    }
  };

  // Fetch User Profile
  const fetchProfile = async () => {
    const access_token = localStorage.getItem('accessToken');
    try {
      console.log('fetchProfile called');

      if (access_token) {
        console.log('accessToken in fetchProfile:', access_token);

        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        console.log('Response Data:', response.data);
      } else {
        console.log('No accessToken available');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (KAKAO_CODE && !localStorage.getItem('accessToken')) {
      fetchAccessToken();
    }
  }, [KAKAO_CODE]);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      fetchProfile();
    }
  }, []);

  return (
    <div>
      <p></p>
    </div>
  );
}

export default KakaoLoginResult;
