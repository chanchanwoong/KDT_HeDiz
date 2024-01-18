import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

export default function PrivateRoute({ element, path }) {
  const navigate = useNavigate();
  useEffect(() => {
    // 토큰이 없는 경우 로그인 페이지로 이동
    if (!isAuthenticated()) {
      console.log("잘못된 접근입니다.")
      navigate('/auth/sign-in');
    }
  }, [navigate, path]);

  return element;
};

const isAuthenticated = () => {
  const token = localStorage.getItem('jwtauthtoken'); 
  return token !== null;
};
