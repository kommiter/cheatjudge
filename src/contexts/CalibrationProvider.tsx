import type { ReactNode } from 'react'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'

interface UserActivity {
  lastActiveTime: number
  isAway: boolean
  awayDuration: number
  warningLevel: number // 0: 정상, 1: 1차 경고, 2: 2차 경고, 3: 강제 종료
}

interface CalibrationContextType {
  isCalibrated: boolean
  setCalibrated: () => void
  resetCalibration: () => void
  userActivity: UserActivity
  setUserActive: () => void
  resetUserActivity: () => void
  gazeData: { x: number; y: number; timestamp: number } | null
  updateGazeData: (x: number, y: number) => void
}

const CalibrationContext = createContext<CalibrationContextType | undefined>(
  undefined,
)

export function CalibrationProvider({ children }: { children: ReactNode }) {
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [gazeData, setGazeData] = useState<{
    x: number
    y: number
    timestamp: number
  } | null>(null)
  const [userActivity, setUserActivity] = useState<UserActivity>({
    lastActiveTime: Date.now(),
    isAway: false,
    awayDuration: 0,
    warningLevel: 0,
  })

  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setCalibrated = useCallback(() => {
    setIsCalibrated(true)
  }, [])

  const resetCalibration = useCallback(() => {
    setIsCalibrated(false)
  }, [])

  const setUserActive = useCallback(() => {
    const now = Date.now()
    setUserActivity((prev) => ({
      ...prev,
      lastActiveTime: now,
      isAway: false,
      awayDuration: 0,
      warningLevel: 0,
    }))

    // 기존 타이머 클리어
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }
  }, [])

  const resetUserActivity = useCallback(() => {
    setUserActivity({
      lastActiveTime: Date.now(),
      isAway: false,
      awayDuration: 0,
      warningLevel: 0,
    })

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }
  }, [])

  const updateGazeData = useCallback((x: number, y: number) => {
    setGazeData({
      x,
      y,
      timestamp: Date.now(),
    })
    // 시선 데이터가 업데이트되면 사용자가 활동 중인 것으로 간주
    const now = Date.now()
    setUserActivity((prev) => ({
      ...prev,
      lastActiveTime: now,
      isAway: false,
      awayDuration: 0,
      warningLevel: 0,
    }))
  }, [])

  // 사용자 활동 감지 이벤트 리스너
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ]

    const handleUserActivity = () => {
      setUserActive()
    }

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [setUserActive])

  // 비활성 상태 감지 및 경고 시스템
  useEffect(() => {
    if (!isCalibrated) return

    const checkActivity = () => {
      const now = Date.now()
      const timeSinceLastActivity = now - userActivity.lastActiveTime

      // 3초 후 1차 경고
      if (timeSinceLastActivity > 3000 && userActivity.warningLevel === 0) {
        setUserActivity((prev) => ({
          ...prev,
          warningLevel: 1,
          isAway: true,
          awayDuration: timeSinceLastActivity,
        }))
      }
      // 30초 후 2차 경고
      else if (
        timeSinceLastActivity > 30000 &&
        userActivity.warningLevel === 1
      ) {
        setUserActivity((prev) => ({
          ...prev,
          warningLevel: 2,
          awayDuration: timeSinceLastActivity,
        }))
      }
      // 3분 후 강제 종료
      else if (
        timeSinceLastActivity > 180000 &&
        userActivity.warningLevel === 2
      ) {
        setUserActivity((prev) => ({
          ...prev,
          warningLevel: 3,
          awayDuration: timeSinceLastActivity,
        }))
      }
    }

    const interval = setInterval(checkActivity, 1000) // 1초마다 체크

    return () => {
      clearInterval(interval)
    }
  }, [isCalibrated, userActivity.lastActiveTime, userActivity.warningLevel])

  return (
    <CalibrationContext.Provider
      value={{
        isCalibrated,
        setCalibrated,
        resetCalibration,
        userActivity,
        setUserActive,
        resetUserActivity,
        gazeData,
        updateGazeData,
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
