import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// 로그인 페이지
import AuthLayout from '../layout/AuthLayout';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// 메인화면
import MainLayout from '../layout/MainLayout';
import Home from '../pages/home/Home';

//헤어샵 페이지
import HairshopDetailPage from '../pages/hairshop/HairshopDetailPage';
import HairstyleDetailPage from '../pages/hairshop/HairstyleDetailPage';

//마이페이지
import Mypage from '../pages/mypage/Mypage';
import MyReservation from '../pages/mypage/MyReservation';
import MyReview from '../pages/mypage/MyReview';

//예약 페이지
import Reservation from '../pages/reservation/Reservation';
import WriteReview from '../pages/mypage/WriteReview';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
    ],
  },

  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'hairshop', element: <HairshopDetailPage /> },
      { path: 'hairstyle', element: <HairstyleDetailPage /> },
      {
        path: 'mypage',
        element: <Mypage />,
      },
      {
        path: 'mypage/list',
        element: <MyReservation />,
      },
      {
        path: 'mypage/review',
        element: <MyReview />,
      },
      {
        path: 'mypage/write-review',
        element: <WriteReview />,
      },
      {
        path: 'reservation',
        element: <Reservation />,
      },
    ],
  },
]);

export default router;
