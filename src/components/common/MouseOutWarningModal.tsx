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

interface MouseOutWarningModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MouseOutWarningModal({
  isOpen,
  onClose,
}: MouseOutWarningModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // 모달이 열릴 때 확인 버튼에 포커스를 주는 useEffect
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 50) // DOM 업데이트 후 포커스를 적용하기 위해 짧은 지연 시간 사용
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>경고</AlertDialogTitle>
          <AlertDialogDescription>
            마우스 포인터가 화면을 벗어났습니다. 시험에 집중해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction ref={confirmButtonRef} onClick={onClose}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
