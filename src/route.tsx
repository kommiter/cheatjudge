import type { RouteObject } from 'react-router'
import { Suspense } from 'react'
import App from '@/App.tsx'

export const PATH = {
  HOME: '/',
}

const routes: RouteObject[] = [
  {
    path: PATH.HOME,
    element: (
      <Suspense>
        <App />
      </Suspense>
    ),
    // errorElement: <Error isRootError />,
    // children: [
    //   {
    //     path: '*',
    //     element: <NotFound />,
    //   },
    // ],
  },
]

export default routes
