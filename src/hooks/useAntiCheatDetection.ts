import { useEffect, useState } from 'react'

export function useAntiCheatDetection(isFullscreenChanging?: boolean) {
  const [isMouseOutAlertOpen, setIsMouseOutAlertOpen] = useState(false)

  // 마우스가 창을 벗어났을 때 경고를 표시하는 useEffect
  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // 전체화면 변경 중이면 마우스 아웃 감지 무시
      if (isFullscreenChanging) {
        return
      }

      // event.relatedTarget이 null이면 마우스가 창 밖으로 나간 것으로 간주
      if (event.relatedTarget === null && !document.hidden) {
        setIsMouseOutAlertOpen(true)
      }
    }

    // document.documentElement에 이벤트 리스너를 추가하여 전체 창을 감지
    document.documentElement.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.documentElement.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isFullscreenChanging])

  return {
    isMouseOutAlertOpen,
    setIsMouseOutAlertOpen,
  }
}
