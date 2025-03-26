import type { RouteObject } from 'react-router'
import { Suspense, lazy } from 'react'
const App = lazy(() => import('@/App.tsx'))
const Home = lazy(() => import('@/pages/Home'))
const Error = lazy(() => import('@/pages/Error'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const IDE = lazy(() => import('@/pages/IDE'))

export const PATH = {
  HOME: '/',
  STUDENT: '/student',
}

const routes: RouteObject[] = [
  {
    path: PATH.HOME,
    element: (
      <Suspense>
        <App />
      </Suspense>
    ),
    errorElement: <Error isRootError />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
      {
        children: [
          {
            path: PATH.STUDENT,
            element: <IDE />,
          },
        ],
      },
    ],
  },
]

export default routes
