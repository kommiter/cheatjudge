import QueryProvider from '@/contexts/QueryProvider.tsx'
import { Outlet } from 'react-router'
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    <QueryProvider>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Outlet />
      </div>
      <Toaster richColors />
    </QueryProvider>
  )
}

export default App
