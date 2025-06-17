import { Outlet } from 'react-router'
import { CalibrationProvider } from '@/contexts/CalibrationProvider'
import { QueryProvider } from '@/contexts/QueryProvider.tsx'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAntiCheatDetection } from '@/hooks/useAntiCheatDetection'
import FullscreenWarningModal from '@/components/common/FullscreenWarningModal'
import MouseOutWarningModal from '@/components/common/MouseOutWarningModal'
import './index.css'

function App() {
  const { shouldShowModal, closeModal, isFullscreenChanging } = useFullscreen()
  const { isMouseOutAlertOpen, setIsMouseOutAlertOpen } =
    useAntiCheatDetection(isFullscreenChanging)

  return (
    <QueryProvider>
      <CalibrationProvider>
        <Outlet />
        <FullscreenWarningModal isOpen={shouldShowModal} onClose={closeModal} />
        <MouseOutWarningModal
          isOpen={isMouseOutAlertOpen}
          onClose={() => setIsMouseOutAlertOpen(false)}
        />
      </CalibrationProvider>
    </QueryProvider>
  )
}

export default App
