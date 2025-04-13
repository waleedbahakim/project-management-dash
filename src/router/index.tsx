import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import SkeletonLoader from '@/components/SkeletonLoader';

// Lazy-loaded components for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Board = lazy(() => import('@/pages/Board'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const Reports = lazy(() => import('@/pages/Reports'));
const Team = lazy(() => import('@/pages/Team'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const SignIn = lazy(() => import('@/pages/SignIn'));

// Loading fallback
const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// Create the router with SignIn as the first page
const router = createBrowserRouter([
  {
    path: '/signin',
    element: (
      <Suspense fallback={<Loader />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SkeletonLoader type="dashboard" />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'board',
        element: (
          <Suspense fallback={<SkeletonLoader type="board" />}>
            <Board />
          </Suspense>
        ),
      },
      {
        path: 'tasks',
        element: (
          <Suspense fallback={<SkeletonLoader type="tasks" />}>
            <Tasks />
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<SkeletonLoader type="calendar" />}>
            <Calendar />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<SkeletonLoader type="reports" />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: 'team',
        element: (
          <Suspense fallback={<SkeletonLoader type="team" />}>
            <Team />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<SkeletonLoader type="settings" />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
} 