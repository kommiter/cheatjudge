import { useEffect, useRef } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ActivityWarningModalProps {
  isOpen: boolean
  warningLevel: number
  onClose: () => void
  onForceExit: () => void
}

export default function ActivityWarningModal({
  isOpen,
  warningLevel,
  onClose,
  onForceExit,
}: ActivityWarningModalProps) {
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  // 모달이 열릴 때 버튼에 포커스
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        continueButtonRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  const handleContinue = () => {
    onClose()
  }

  const getWarningMessage = () => {
    switch (warningLevel) {
      case 1:
        return {
          title: '활동 감지 경고',
          message:
            '3초 동안 모니터에 시선이 감지되지 않았습니다. 시험을 계속 진행하시겠습니까?',
          buttonText: '시험 계속하기',
        }
      case 2:
        return {
          title: '최종 경고',
          message:
            '1분 동안 모니터에 시선이 감지되지 않았습니다. 2분 후 자동으로 시험이 종료됩니다.',
          buttonText: '시험 계속하기',
        }
      case 3:
        return {
          title: '시험 종료',
          message: '3분 동안 시선이 감지되지 않아 시험이 자동으로 종료됩니다.',
          buttonText: '확인',
        }
      default:
        return {
          title: '',
          message: '',
          buttonText: '',
        }
    }
  }

  const { title, message, buttonText } = getWarningMessage()

  const getIconColor = () => {
    switch (warningLevel) {
      case 1:
        return 'text-yellow-600'
      case 2:
        return 'text-orange-600'
      case 3:
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            {/* 경고 아이콘 */}
            <div className="w-16 h-16 mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className={`w-8 h-8 ${getIconColor()}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L5.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <div className="text-center text-gray-600">
          <AlertDialogDescription className="text-center text-gray-600">
            {message}
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="flex gap-2 justify-center">
          {/* 시험 계속하기 버튼 (경고 레벨 1, 2에서만 표시) */}
          {warningLevel < 3 && (
            <AlertDialogAction
              ref={continueButtonRef}
              onClick={handleContinue}
              className={
                warningLevel === 1
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }
            >
              {buttonText}
            </AlertDialogAction>
          )}

          {/* 확인 버튼 (경고 레벨 3에서만 표시) */}
          {warningLevel === 3 && (
            <AlertDialogAction
              ref={continueButtonRef}
              onClick={onForceExit}
              className="bg-red-600 hover:bg-red-700"
            >
              {buttonText}
            </AlertDialogAction>
          )}

          {/* 시험 종료 버튼 (경고 레벨 1, 2에서만 표시) */}
          {warningLevel < 3 && (
            <AlertDialogCancel
              onClick={onForceExit}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              시험 종료
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
