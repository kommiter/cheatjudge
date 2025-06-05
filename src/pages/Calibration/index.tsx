import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCalibration } from '@/contexts/CalibrationProvider'
import type { CalibrationPoint } from '@/types/webgazer'
import './calibration.css'

export default function Calibration() {
  const navigate = useNavigate()
  const { isWebGazerReady, setCalibrated, initializeWebGazer } =
    useCalibration()

  const [isCalibrating, setIsCalibrating] = useState(false)
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [status, setStatus] = useState('웹캠 초기화 중...')

  // 캘리브레이션 포인트 정의 (화면의 9개 지점)
  const calibrationPoints: CalibrationPoint[] = useMemo(
    () => [
      { id: 1, x: 10, y: 10, label: '왼쪽 상단' },
      { id: 2, x: 50, y: 10, label: '중앙 상단' },
      { id: 3, x: 90, y: 10, label: '오른쪽 상단' },
      { id: 4, x: 10, y: 50, label: '왼쪽 중앙' },
      { id: 5, x: 50, y: 50, label: '정중앙' },
      { id: 6, x: 90, y: 50, label: '오른쪽 중앙' },
      { id: 7, x: 10, y: 90, label: '왼쪽 하단' },
      { id: 8, x: 50, y: 90, label: '중앙 하단' },
      { id: 9, x: 90, y: 90, label: '오른쪽 하단' },
    ],
    [],
  )

  // WebGazer 초기화 상태 확인 및 자동 캘리브레이션 시작
  useEffect(() => {
    if (isWebGazerReady && !isCalibrating && !isCompleted) {
      // WebGazer가 준비되면 자동으로 캘리브레이션 시작
      setIsCalibrating(true)
      setCurrentPointIndex(0)
      setStatus(`캘리브레이션 포인트 ${1}/9: ${calibrationPoints[0].label}`)
    } else if (!isWebGazerReady) {
      setStatus('웹캠 초기화 중...')
      initializeWebGazer().then((success) => {
        if (!success) {
          setStatus(
            '웹캠 초기화에 실패했습니다. 브라우저에서 카메라 권한을 허용해주세요.',
          )
        }
      })
    }
  }, [
    isWebGazerReady,
    initializeWebGazer,
    isCalibrating,
    isCompleted,
    calibrationPoints,
  ])

  const clickCalibrationPoint = (point: CalibrationPoint, index: number) => {
    if (!isCalibrating || index !== currentPointIndex) return

    // WebGazer에 캘리브레이션 포인트 추가
    const screenX = (window.innerWidth * point.x) / 100
    const screenY = (window.innerHeight * point.y) / 100

    if (window.webgazer) {
      ;(
        window.webgazer as unknown as {
          recordScreenPosition: (
            x: number,
            y: number,
            eventType?: string,
          ) => void
        }
      ).recordScreenPosition(screenX, screenY, 'click')
    }

    // 다음 포인트로 이동
    if (currentPointIndex < calibrationPoints.length - 1) {
      const nextIndex = currentPointIndex + 1
      setCurrentPointIndex(nextIndex)
      setStatus(
        `캘리브레이션 포인트 ${nextIndex + 1}/9: ${calibrationPoints[nextIndex].label}`,
      )
    } else {
      // 캘리브레이션 완료
      setIsCalibrating(false)
      setIsCompleted(true)
      setStatus('캘리브레이션이 완료되었습니다! 3초 후 홈으로 이동합니다.')
      setCalibrated() // CalibrationProvider에 캘리브레이션 완료 알림

      // 3초 후 홈으로 자동 이동
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 간단한 상태 표시 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white shadow-md rounded-lg px-6 py-3">
          <p className="text-sm text-gray-600">{status}</p>
        </div>
      </div>

      {/* 메인 캘리브레이션 영역 */}
      <div className="pt-16 pb-8">
        {/* 나머지 내용은 동일 */}
        {isCalibrating && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              빨간 원을 순서대로 클릭하세요
            </h2>
            <p className="text-gray-600">
              각 점을 클릭할 때 화면을 정확히 응시해주세요
            </p>
          </div>
        )}

        {/* 캘리브레이션 포인트들 */}
        {(isCalibrating || isWebGazerReady) && (
          <div className="calibration-area">
            {calibrationPoints.map((point, index) => {
              const isActive = isCalibrating && index === currentPointIndex
              const isPointCompleted =
                isCalibrating && index < currentPointIndex

              return (
                <div
                  key={point.id}
                  className={`calibration-point point-${point.id} ${isActive ? 'active' : ''}`}
                  onClick={() => clickCalibrationPoint(point, index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-white ${
                      isPointCompleted
                        ? 'bg-green-500 border-green-600'
                        : isActive
                          ? 'bg-red-500 border-red-600 shadow-lg animate-pulse'
                          : isCalibrating
                            ? 'bg-gray-400 border-gray-500'
                            : 'bg-blue-400 border-blue-500 opacity-50'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {isActive && (
                    <div className="calibration-point-label bg-black bg-opacity-75 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
                      {point.label}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 안내 텍스트 */}
        {!isCalibrating && !isCompleted && isWebGazerReady && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              시선 추적 캘리브레이션 준비 중...
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              잠시 후 캘리브레이션이 자동으로 시작됩니다.
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              캘리브레이션 완료!
            </h2>
            <p className="text-gray-600 mb-6">
              시선 추적 캘리브레이션이 성공적으로 완료되었습니다. 잠시 후 홈으로
              이동합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
