import axios from 'axios';

// Axios 인스턴스를 생성하는 함수
const createAxiosInstance = (headers = {}, options = {}) => {
  return axios.create({
    // baseURL: process.env.REACT_APP_AXIOS_BASE_URL || 'http://localhost:8090',
    baseURL: process.env.REACT_APP_AXIOS_BASE_URL || '/hediz-client-server',
    headers: {
      ...headers,
    },
    ...options,
  });
};

// 인증이 필요하지 않은 API용 Axios 인스턴스를 생성하는 함수
const nonAuthAPI = (options = {}) => {
  return createAxiosInstance({}, options);
};

// 인증이 필요한 API용 Axios 인스턴스를 생성하는 함수
const authAPI = (options = {}) => {
  // 인증 토큰을 헤더에 추가
  const token = localStorage.getItem('jwtauthtoken');
  const authHeaders = {
    jwtauthtoken: token,
  };
  return createAxiosInstance(authHeaders, options);
};

// React.js에서 사용할 때 편의를 위해 이름을 변경한 함수들
export const nonAuthAxios = nonAuthAPI;
export const authAxios = authAPI;
