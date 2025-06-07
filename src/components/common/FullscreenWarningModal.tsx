import { useEffect, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface FullscreenWarningModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullscreenWarningModal({
  isOpen,
  onClose,
}: FullscreenWarningModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // 모달이 열릴 때 버튼에 포커스
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  const handleEnterFullscreen = async () => {
    try {
      const element = document.documentElement

      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen()
      }
      onClose()
    } catch (error) {
      console.error('전체화면 진입 실패:', error)
      // 전체화면 진입이 실패해도 모달은 닫음
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            {/* 전체화면 아이콘 */}
            <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              전체화면 모드 필요
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <div className="text-center">
          <AlertDialogDescription className="text-center text-gray-600">
            시험 진행을 위해 전체화면 모드로 전환해야 합니다.
            <br />
            아래 버튼을 클릭하여 전체화면 모드를 활성화하세요.
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction
            ref={confirmButtonRef}
            onClick={handleEnterFullscreen}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            전체화면 모드 활성화
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
