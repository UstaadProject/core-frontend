// src/routes.tsx
import Login from '@/pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import LearningPath from './pages/learning/LearningPath';
import LessonDetail from './pages/learning/LessonDetail';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

// Wrap pages with layouts here
export const routes: AppRoute[] = [
  {
    path: '/',
    element: <Navigate to='/login' replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/learning-path',
    element: <LearningPath />,
  },
  {
    path: '/lesson/:moduleId/:topic',
    element: <LessonDetail />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
