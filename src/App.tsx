import { Outlet } from 'react-router'
import { CalibrationProvider } from '@/contexts/CalibrationProvider'
// import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import './index.css'

function App() {
  return (
    <CalibrationProvider>
      <Outlet />
    </CalibrationProvider>
  )
}

export default App
