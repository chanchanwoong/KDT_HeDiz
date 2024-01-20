import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// 로그인 페이지
import AuthLayout from '../layout/AuthLayout';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// 메인화면
import MainLayout from '../layout/MainLayout';
import Home from '../pages/home/home';
import HairshopPage from '../pages/home/HairshopPage';

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
      { path: 'home', element: <Home /> },
      { path: 'hairshop', element: <HairshopPage /> },
    ],
  },
]);

export default router;
