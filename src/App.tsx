import { Outlet } from 'react-router'
import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import './index.css'

function App() {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  )
}

export default App
