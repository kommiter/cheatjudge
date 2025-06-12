import { Outlet } from 'react-router'
import { CalibrationProvider } from '@/contexts/CalibrationProvider'
import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import { useFullscreen } from '@/hooks/useFullscreen'
import FullscreenWarningModal from '@/components/common/FullscreenWarningModal'
import './index.css'

function App() {
  const { shouldShowModal, closeModal } = useFullscreen()

  return (
    <QueryProvider>
      <CalibrationProvider>
        <Outlet />
        <FullscreenWarningModal isOpen={shouldShowModal} onClose={closeModal} />
      </CalibrationProvider>
    </QueryProvider>
  )
}

export default App
