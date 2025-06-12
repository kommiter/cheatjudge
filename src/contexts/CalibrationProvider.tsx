import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import type { WebGazerData } from '@/types/webgazer'

interface UserActivity {
  warningLevel: number
  lastActiveTime: number
  gazeOutOfBounds: number
  isModalShown: boolean
}

interface CalibrationContextType {
  isCalibrated: boolean
  isWebGazerReady: boolean
  userActivity: UserActivity
  currentGaze: WebGazerData | null
  isPredictionPointsVisible: boolean
  setCalibrated: () => void
  resetCalibration: () => void
  resetModalState: () => void
  initializeWebGazer: () => Promise<boolean>
  startGazeTracking: () => void
  stopGazeTracking: () => void
  togglePredictionPoints: () => void
}

const CalibrationContext = createContext<CalibrationContextType | undefined>(
  undefined,
)

export function CalibrationProvider({ children }: { children: ReactNode }) {
  const [isCalibrated, setIsCalibrated] = useState(true)
  const [isWebGazerReady, setIsWebGazerReady] = useState(false)
  const [currentGaze, setCurrentGaze] = useState<WebGazerData | null>(null)
  const [isPredictionPointsVisible, setIsPredictionPointsVisible] =
    useState(true)
  const [userActivity, setUserActivity] = useState<UserActivity>({
    warningLevel: 0,
    lastActiveTime: Date.now(),
    gazeOutOfBounds: 0,
    isModalShown: false,
  })

  // WebGazer 초기화
  async function initializeWebGazer() {
    try {
      if (!window.webgazer) {
        console.error('WebGazer not loaded')
        return false
      }

      // 기존 데이터와 모델을 완전히 삭제
      window.webgazer.clearData()

      // localStorage에서 WebGazer 관련 데이터 삭제
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('webgazer')) {
          localStorage.removeItem(key)
        }
      })

      await window.webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .showVideo(true)
        .showPredictionPoints(true)
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true)
        .begin()

      setIsWebGazerReady(true)
      return true
    } catch (error) {
      console.error('WebGazer initialization failed:', error)
      return false
    }
  }

  // 시선 추적 시작
  function startGazeTracking() {
    if (!window.webgazer || !isWebGazerReady) return

    window.webgazer.setGazeListener((data: WebGazerData | null) => {
      if (data) {
        setCurrentGaze(data)
        updateUserActivity(data)
      }
    })
  }

  // 시선 추적 중지
  function stopGazeTracking() {
    if (!window.webgazer) return
    window.webgazer.setGazeListener(null)
  }

  // 사용자 활동 업데이트
  function updateUserActivity(gazeData: WebGazerData) {
    const now = Date.now()
    const isOutOfBounds =
      gazeData.x < 0 ||
      gazeData.x > window.innerWidth ||
      gazeData.y < 0 ||
      gazeData.y > window.innerHeight

    setUserActivity((prev) => {
      const newActivity = { ...prev, lastActiveTime: now }

      if (isOutOfBounds) {
        newActivity.gazeOutOfBounds += 1

        // 경고 레벨 계산
        if (newActivity.gazeOutOfBounds > 80 * 20 * 3) {
          newActivity.warningLevel = 3 // 강제 종료
          newActivity.isModalShown = true
        } else if (newActivity.gazeOutOfBounds > 80 * 20) {
          newActivity.warningLevel = 2 // 심각한 경고
          newActivity.isModalShown = true
        } else if (newActivity.gazeOutOfBounds > 80) {
          newActivity.warningLevel = 1 // 일반 경고
          newActivity.isModalShown = true
        }
      } else {
        // 화면 내부에 시선이 있으면 카운터 리셋하지만 모달이 표시된 상태라면 경고 레벨 유지
        newActivity.gazeOutOfBounds = Math.max(
          0,
          newActivity.gazeOutOfBounds - 1,
        )
        // 모달이 표시되지 않은 상태에서만 경고 레벨을 0으로 리셋
        if (newActivity.gazeOutOfBounds < 20 && !newActivity.isModalShown) {
          newActivity.warningLevel = 0
        }
      }

      return newActivity
    })
  }

  // 예측 포인트 토글
  function togglePredictionPoints() {
    if (!window.webgazer || !isWebGazerReady) return

    const newVisibility = !isPredictionPointsVisible
    setIsPredictionPointsVisible(newVisibility)
    window.webgazer.showPredictionPoints(newVisibility)
  }

  function setCalibrated() {
    setIsCalibrated(true)
  }

  function resetModalState() {
    setUserActivity((prev) => ({
      ...prev,
      warningLevel: 0,
      isModalShown: false,
    }))
  }

  function resetCalibration() {
    setIsCalibrated(false)
    stopGazeTracking()
    if (window.webgazer) {
      window.webgazer.clearData()
    }
    setUserActivity({
      warningLevel: 0,
      lastActiveTime: Date.now(),
      gazeOutOfBounds: 0,
      isModalShown: false,
    })
  }

  return (
    <CalibrationContext.Provider
      value={{
        isCalibrated,
        isWebGazerReady,
        userActivity,
        currentGaze,
        isPredictionPointsVisible,
        setCalibrated,
        resetCalibration,
        resetModalState,
        initializeWebGazer,
        startGazeTracking,
        stopGazeTracking,
        togglePredictionPoints,
      }}
    >
      {children}
    </CalibrationContext.Provider>
  )
}

export function useCalibration() {
  const context = useContext(CalibrationContext)
  if (context === undefined) {
    throw new Error('useCalibration must be used within a CalibrationProvider')
  }
  return context
}
