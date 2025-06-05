import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import type { CalibrationPoint } from '@/types/webgazer'
import { useCalibration } from '@/contexts/CalibrationProvider'
import {
  POINT_POSITION_CLASSES,
  CALIBRATION_POINTS,
  CALIBRATION_COMPLETE_DELAY,
} from '@/constants/calibration'
import { cn } from '@/lib/utils'
import { PATH } from '@/routes'

export default function Calibration() {
  const navigate = useNavigate()
  const { isWebGazerReady, setCalibrated, initializeWebGazer } =
    useCalibration()

  const [isCalibrating, setIsCalibrating] = useState(false)
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // WebGazer 초기화 상태 확인 및 자동 캘리브레이션 시작
  useEffect(() => {
    if (isWebGazerReady && !isCalibrating && !isCompleted) {
      // WebGazer가 준비되면 자동으로 캘리브레이션 시작
      setIsCalibrating(true)
      setCurrentPointIndex(0)
    } else if (!isWebGazerReady) {
      initializeWebGazer().then((success) => {
        if (!success) {
          console.error('웹캠 초기화에 실패했습니다.')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebGazerReady, isCalibrating, isCompleted])

  const clickCalibrationPoint = (point: CalibrationPoint, index: number) => {
    if (!isCalibrating || index !== currentPointIndex) return

    // WebGazer에 캘리브레이션 포인트 추가
    const screenX = (window.innerWidth * point.x) / 100
    const screenY = (window.innerHeight * point.y) / 100

    if (window.webgazer) {
      window.webgazer.recordScreenPosition(screenX, screenY, 'click')
    }

    // 다음 포인트로 이동
    if (currentPointIndex < CALIBRATION_POINTS.length - 1) {
      const nextIndex = currentPointIndex + 1
      setCurrentPointIndex(nextIndex)
    } else {
      // 캘리브레이션 완료
      setIsCalibrating(false)
      setIsCompleted(true)
      setCalibrated() // CalibrationProvider에 캘리브레이션 완료 알림

      // 3초 후 홈으로 자동 이동
      setTimeout(() => {
        navigate(PATH.EXAM, { replace: true })
      }, CALIBRATION_COMPLETE_DELAY)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 캘리브레이션 포인트들 */}
      {(isCalibrating || isWebGazerReady) && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[1]">
          {CALIBRATION_POINTS.map((point, index) => {
            const isActive = isCalibrating && index === currentPointIndex
            const isPointCompleted = isCalibrating && index < currentPointIndex

            return (
              <div
                key={point.id}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out z-20',
                  POINT_POSITION_CLASSES[
                    point.id as keyof typeof POINT_POSITION_CLASSES
                  ],
                  isActive && 'scale-125',
                )}
                onClick={() => clickCalibrationPoint(point, index)}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-3 flex items-center justify-center font-bold text-white text-sm',
                    {
                      'bg-green-500 border-green-600': isPointCompleted,
                      'bg-red-500 border-red-600 shadow-lg animate-pulse':
                        isActive,
                      'bg-gray-400 border-gray-500':
                        isCalibrating && !isActive && !isPointCompleted,
                      'bg-blue-400 border-blue-500 opacity-50': !isCalibrating,
                    },
                  )}
                >
                  {index + 1}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 초기화 텍스트 - 화면 중앙에 표시 */}
      {!isWebGazerReady && !isCalibrating && !isCompleted && (
        <div className="fixed inset-0 flex items-center justify-center z-[10]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              웹캠 초기화 중...
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              브라우저에서 카메라 권한을 허용해주세요. 시선 추적 캘리브레이션을
              위해 웹캠이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-[30]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              캘리브레이션 완료!
            </h2>
            <p className="text-gray-600 mb-6">
              시선 추적 캘리브레이션이 성공적으로 완료되었습니다. 잠시 후 시험
              화면으로 이동합니다.
            </p>
          </div>
        </div>
      )}

      {/* 캘리브레이션 중일 때만 상단에 간단한 안내 표시 */}
      {isCalibrating && (
        <div className="fixed top-40 left-1/2 -translate-x-1/2 z-[15] text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            빨간 원을 순서대로 클릭하세요
          </h2>
          <p className="text-sm text-gray-600">
            각 점을 클릭할 때 화면을 정확히 응시해주세요
          </p>
        </div>
      )}
    </div>
  )
}
