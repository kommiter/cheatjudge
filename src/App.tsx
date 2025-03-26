import QueryProvider from '@/contexts/QueryProvider.tsx'
import './index.css'
import { Outlet } from 'react-router'

function App() {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  )
}

export default App
