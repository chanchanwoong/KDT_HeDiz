import { createBrowserRouter } from 'react-router-dom';

// 서비스 페이지
import MainLayout from 'pages/layout/MainLayout';
import Home from 'pages/Home';
import Hairshop from 'pages/Hairshop';
import HairStyle from 'pages/Hairstyle';
import Schedule from 'pages/Schedule';
import Reservation from 'pages/Reservation';
import Payment from 'pages/Payment';
import MyPage from 'pages/MyPage';

// 인증 페이지
import SignIn from 'pages/auth/SignIn';
import SignUp from 'pages/auth/SignUp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'hairshop/:shop_seq', element: <Hairshop /> },
      {
        path: 'hairshop/:shop_seq/hairstyle/:style_seq',
        element: <HairStyle />,
      },
      { path: 'schedule', element: <Schedule /> },
      { path: 'reservation', element: <Reservation /> },
      { path: 'payment', element: <Payment /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  {
    path: '/auth',
    element: <MainLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
    ],
  },
]);

export default router;
