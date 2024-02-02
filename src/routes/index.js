import { createBrowserRouter } from 'react-router-dom';

// 로그인 페이지
import AuthLayout from '../layout/AuthLayout';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// 메인화면
import MainLayout from '../layout/MainLayout';
import Home from 'pages/home/home';
import Reservation from '../pages/reservation/CheckReservation';

//헤어샵 페이지
import HairshopDetailPage from '../pages/hairshop/HairshopDetailPage';
import HairstyleDetailPage from '../pages/hairshop/HairstyleDetailPage';
import HairshopReservation from '../pages/hairshop/HairshopReservation';
import HairshopPayment from '../pages/hairshop/HairshopPayment';

//마이페이지
import Mypage from '../pages/mypage/Mypage';
import MyReservation from '../pages/mypage/MyReservation';
import MyReview from '../pages/mypage/MyReview';
import WriteReview from '../pages/mypage/WriteReview';

//예약 페이지

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
