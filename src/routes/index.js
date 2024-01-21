import { createBrowserRouter,Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// 로그인 페이지
import AuthLayout from '../layout/AuthLayout';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// 메인화면
import MainLayout from '../layout/MainLayout';
import Home from '../pages/home/Home'
import HairshopPage from '../pages/home/HairshopDetailPage';
import Mypage from '../pages/mypage/Mypage';
import MyReservation from '../pages/reservation/MyReservation';

//마이페이지

//예약 페이지

const router = createBrowserRouter(
  [
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "sign-in", element: <SignIn /> },
        { path: "sign-up", element: <SignUp /> },
      ],
    },


    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "hairshop", element: <HairshopPage /> },

        {
          path: "/mypage",
          children: [
            { path: "mypage", element: <Mypage /> },
            { path: "reservation", element: <MyReservation /> },
          ],
        },
      ],
    },

  ]
);

export default router;
