import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// 인증, 전체 레이아웃
import AuthLayout from 'components/layout/AuthLayout';
import MainLayout from 'components/layout/MainLayout';

// auth__인증
import SignIn from 'pages/auth/SignIn';
import SignUp from 'pages/auth/SignUp';
import Find from 'pages/auth/Find';

// home__바로가기
import Dashboard from 'pages/home/Dashboard';
import RealtimeReservation from 'pages/home/RealtimeReservation';

// hairshop__미용실 관리
import Info from 'pages/hairshop/Info';
import Hairstyle from 'pages/hairshop/Hairstyle';
import Staff from 'pages/hairshop/Staff';
import ClosedDay from 'pages/hairshop/ClosedDay';

// reservation__예약 관리
import Total from 'pages/reservation/Total';
import Review from 'pages/reservation/Review';

// customer__고객 관리
import Management from 'pages/customer/Management';
import Coupon from 'pages/customer/Coupon';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'find', element: <Find /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute
            element={<Dashboard />}
            path='/'
          />
        ),
        children: [
          { path: 'home', element: <PrivateRoute path='/home' /> },
          { path: 'hairshop', element: <PrivateRoute path='/hairshop' /> },
          {
            path: 'reservation',
            element: <PrivateRoute path='/reservation' />,
          },
          { path: 'customer', element: <PrivateRoute path='/customer' /> },
        ],
      },
      {
        path: '/home',
        children: [
          {
            path: 'realtime-reservation',
            element: (
              <PrivateRoute
                element={<RealtimeReservation />}
                path='/home/realtime-reservation'
              />
            ),
          },
        ],
      },
      {
        path: '/hairshop',
        children: [
          {
            path: 'info',
            element: (
              <PrivateRoute
                element={<Info />}
                path='/hairshop/info'
              />
            ),
          },
          {
            path: 'hairstyle',
            element: (
              <PrivateRoute
                element={<Hairstyle />}
                path='/hairshop/hairstyle'
              />
            ),
          },
          {
            path: 'staff',
            element: (
              <PrivateRoute
                element={<Staff />}
                path='/hairshop/staff'
              />
            ),
          },
          {
            path: 'closed-day',
            element: (
              <PrivateRoute
                element={<ClosedDay />}
                path='/hairshop/closed-day'
              />
            ),
          },
        ],
      },
      {
        path: '/reservation',
        children: [
          {
            path: 'total',
            element: (
              <PrivateRoute
                element={<Total />}
                path='/reservation/total'
              />
            ),
          },
          {
            path: 'review',
            element: (
              <PrivateRoute
                element={<Review />}
                path='/reservation/review'
              />
            ),
          },
        ],
      },
      {
        path: '/customer',
        children: [
          {
            path: 'management',
            element: (
              <PrivateRoute
                element={<Management />}
                path='/customer/management'
              />
            ),
          },
          {
            path: 'coupon',
            element: (
              <PrivateRoute
                element={<Coupon />}
                path='/customer/coupon'
              />
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
