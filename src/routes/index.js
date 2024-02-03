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
import WriteReview from 'components/WriteReview';

// 인증 페이지
import SignIn from 'pages/auth/SignIn';
import SignUp from 'pages/auth/SignUp';

//에러 페이지
import ErrorPage404 from 'pages/error/ErrorPage404';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage404 />,
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
      {
        path: 'mypage/write-review',
        element: <WriteReview />,
      },
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
