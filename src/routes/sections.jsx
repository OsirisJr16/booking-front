/* eslint-disable */
import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const Rooms = lazy(() => import('src/pages/rooms'));
export const Booking = lazy(() => import('src/pages/booking'));
export const RoomsTypes = lazy(() => import('src/pages/room-types'));
export const Payment = lazy(() => import('src/pages/payment'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'reservations', element: <Booking /> },
        { path: 'chambres', element: <Rooms /> },
        { path: 'payment', element: <Payment /> },
        { path: 'type-chambres', element: <RoomsTypes /> }
      ],
    },
  ]);

  return routes;
}
