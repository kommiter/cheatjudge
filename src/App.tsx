import { Outlet } from 'react-router'
import { CalibrationProvider } from '@/contexts/CalibrationProvider'
import { useFullscreen } from '@/hooks/useFullscreen'
import FullscreenWarningModal from '@/components/common/FullscreenWarningModal'
// import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import './index.css'

function App() {
  const { shouldShowModal, closeModal } = useFullscreen()

  return (
    <CalibrationProvider>
      <Outlet />
      <FullscreenWarningModal isOpen={shouldShowModal} onClose={closeModal} />
    </CalibrationProvider>
  )
}

export default App
