// src/routes.tsx
import Login from '@/pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import type { JSX } from 'react';

export interface AppRoute {
  path: string;
  element: JSX.Element;
}

// Wrap pages with layouts here
export const routes: AppRoute[] = [
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
    path: '*',
    element: <NotFound />,
  },
];
