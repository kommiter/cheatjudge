import { useEffect, useState } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // 전체화면 상태 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement,
      )

      setIsFullscreen(isCurrentlyFullscreen)

      // 초기화 후에만 모달 표시 로직 실행
      if (hasInitialized) {
        if (!isCurrentlyFullscreen) {
          setShouldShowModal(true)
        } else {
          setShouldShowModal(false)
        }
      }
    }

    // 초기 상태 확인 및 설정
    const checkInitialState = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement,
      )

      setIsFullscreen(isCurrentlyFullscreen)

      // 초기에 전체화면이 아니라면 모달 표시
      if (!isCurrentlyFullscreen) {
        setShouldShowModal(true)
      }

      setHasInitialized(true)
    }

    // DOM이 준비된 후 초기 상태 확인
    if (document.readyState === 'complete') {
      checkInitialState()
    } else {
      window.addEventListener('load', checkInitialState)
    }

    // 전체화면 상태 변경 이벤트 리스너 등록
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      window.removeEventListener('load', checkInitialState)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange,
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [hasInitialized])

  // 강제 전체화면 진입
  const enterFullscreen = async () => {
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
    } catch (error) {
      console.error('전체화면 진입 실패:', error)
    }
  }

  const closeModal = () => {
    setShouldShowModal(false)
  }

  return {
    isFullscreen,
    shouldShowModal,
    enterFullscreen,
    closeModal,
  }
}
