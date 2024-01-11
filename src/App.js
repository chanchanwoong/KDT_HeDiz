import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 인증, 전체 레이아웃
import AuthLayout from 'components/layout/AuthLayout';
import MainLayout from 'components/layout/MainLayout';

// auth__인증
import SignIn, { action as LoginAction } from 'pages/auth/SignIn';
import SignUp from 'pages/auth/SIgnUp';
import Find from 'pages/auth/Find';

// home__바로가기
import Test from 'pages/home/Test';
import Dashboard from 'pages/home/Dashboard';
import RealtimeReservation from 'pages/home/RealtimeReservation';
import Mypage from 'pages/home/Mypage';

// hairshop__미용실 관리
import Info, { action as Hairshopaction } from 'pages/hairshop/Info';
import Hairstyle from 'pages/hairshop/Hairstyle';
import Staff from 'pages/hairshop/Staff';
import ClosedDay from 'pages/hairshop/ClosedDay';

// reservation__예약 관리
import Total from 'pages/reservation/Total';
import Review from 'pages/reservation/Review';
import Alarm from 'pages/reservation/Alarm';

// customer__고객 관리
import Management from 'pages/customer/Management';

// sales__매출 관리
import Summary from 'pages/sales/Summary';
import KakaoLoginResult from 'components/common/KakaoLoginResult';

const router = createBrowserRouter([
  {
    path: '/KakaoLoginResult',
    element: <KakaoLoginResult />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn />, action: LoginAction },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'find', element: <Find /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/home',
        children: [
          { path: 'test', element: <Test /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'realtime-reservation', element: <RealtimeReservation /> },
          { path: 'mypage', element: <Mypage /> },
        ],
      },
      {
        path: '/hairshop',
        children: [
          { path: 'info', element: <Info />, action: Hairshopaction },
          { path: 'hairstyle', element: <Hairstyle /> },
          { path: 'staff', element: <Staff /> },
          { path: 'closed-day', element: <ClosedDay /> },
        ],
      },
      {
        path: '/reservation',
        children: [
          { path: 'total', element: <Total /> },
          { path: 'review', element: <Review /> },
          { path: 'alarm', element: <Alarm /> },
        ],
      },
      {
        path: '/customer',
        element: <Management />,
        children: [{ path: 'management', element: <Management /> }],
      },
      {
        path: '/sales',
        element: <Summary />,
        children: [{ path: 'summary', element: <Summary /> }],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
