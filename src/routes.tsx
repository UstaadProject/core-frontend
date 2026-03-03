// src/routes.tsx
import Login from '@/pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import Leaderboard from './pages/dashboard/Leaderboard';
import ResumeBuilder from './pages/dashboard/ResumeBuilder';
import Achievements from './pages/dashboard/Achievements';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import LearningPath from './pages/learning/LearningPath';
import LessonDetail from './pages/learning/LessonDetail';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';

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
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/achievements',
    element: (
      <ProtectedRoute>
        <Achievements />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resume-builder',
    element: (
      <ProtectedRoute>
        <ResumeBuilder />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/learning-path',
    element: (
      <ProtectedRoute>
        <LearningPath />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson/:moduleId/:topic',
    element: (
      <ProtectedRoute>
        <LessonDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
