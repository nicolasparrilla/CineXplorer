import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserList from './pages/UserList';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import MoviesPage from './pages/MoviesPage';
import Inicio from './pages/Inicio';
import MovieDetailPage from './pages/MovieDetailPage';
import PassRecovery from './pages/RecoverPassword';
import ResetPassword from './pages/ResetPassword';
import RegisterPage from './pages/RegisterPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/inicio" />, index: true },
        { path: 'inicio', element: <Inicio /> },
        { path: 'peliculas', element: <MoviesPage /> },
        { path: 'peliculas/:idMovie', element: <MovieDetailPage /> },
        { path: 'listas/:idList', element: <UserList />}

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    { 
      path: 'forgotpassword',
      element: <PassRecovery />,
    },
    {
      path: 'recupero',
      element: <ResetPassword />,
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
