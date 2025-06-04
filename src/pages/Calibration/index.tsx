import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import webgazer from 'webgazer'
import { useCalibration } from '@/contexts/CalibrationProvider'

interface CalibrationPoint {
  id: number
  x: number
  y: number
  samples: number
}

const TOTAL_SAMPLES = process.env.NODE_ENV === 'development' ? 1 : 3
const CARD_HORIZONTAL_PADDING = 32

export default function Calibration() {
  const navigate = useNavigate()
  const { setCalibrated, updateGazeData } = useCalibration()
  const [prediction, setPrediction] = useState<{ x: number; y: number } | null>(
    null,
  )

  // DOM 요소 캐싱
  const overlayRef = useRef<HTMLElement | null>(null)

  // 초기 포인트 배열을 useMemo로 최적화
  const initialPoints = useMemo(
    () => [
      { id: 1, x: 5, y: 5, samples: 0 },
      { id: 2, x: 50, y: 5, samples: 0 },
      { id: 3, x: 95, y: 5, samples: 0 },
      { id: 4, x: 5, y: 50, samples: 0 },
      { id: 5, x: 50, y: 50, samples: 0 },
      { id: 6, x: 95, y: 50, samples: 0 },
      { id: 7, x: 5, y: 95, samples: 0 },
      { id: 8, x: 50, y: 95, samples: 0 },
      { id: 9, x: 95, y: 95, samples: 0 },
    ],
    [],
  )

  // 포인트 상태를 초기화
  const [points, setPoints] = useState<CalibrationPoint[]>(initialPoints)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isTrained, setIsTrained] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden', 'h-screen')
    document.body.classList.add('overflow-hidden', 'h-screen', 'm-0')

    return () => {
      document.documentElement.classList.remove('overflow-hidden', 'h-screen')
      document.body.classList.remove('overflow-hidden', 'h-screen', 'm-0')
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // updateOverlayPosition 함수를 useCallback으로 최적화
  const updateOverlayPosition = useCallback(() => {
    const card = cardRef.current
    if (!overlayRef.current) {
      overlayRef.current = document.querySelector(
        '.webgazerFaceOverlay',
      ) as HTMLElement
    }
    const overlay = overlayRef.current
    if (card && overlay) {
      const cardRect = card.getBoundingClientRect()
      overlay.style.position = 'fixed'
      overlay.style.left = `${cardRect.left + CARD_HORIZONTAL_PADDING}px`
      overlay.style.top = `${cardRect.top + 100}px`
      overlay.style.width = `340px`
      overlay.style.height = `260px`
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '1'
      overlay.style.background = 'transparent'
      overlay.style.display = 'block'
    }
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleUpdate = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateOverlayPosition, 100)
    }

    // 초기 실행
    handleUpdate()

    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate)
    }
  }, [updateOverlayPosition])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.webgazer) {
      window.webgazer = webgazer
    }

    let isInitialized = false
    let isCleanedUp = false

    const initializeWebgazer = async () => {
      if (isInitialized || isCleanedUp) return
      isInitialized = true

      try {
        // 기존 webgazer가 있다면 먼저 정리
        if (window.webgazer && typeof window.webgazer.end === 'function') {
          try {
            await window.webgazer.end()
          } catch (e) {
            console.warn('Previous webgazer cleanup warning:', e)
          }
        }

        await webgazer.clearData()
        await webgazer.begin()
        await webgazer.setGazeListener(() => {})
        await webgazer.setRegression('ridge')
        await webgazer.setTracker('TFFacemesh')
        await webgazer.showVideo(true)
        await webgazer.showPredictionPoints(true)
        await webgazer.saveDataAcrossSessions(false)
      } catch (error) {
        console.error('Webgazer 초기화 실패:', error)
        isInitialized = false
      }
    }

    initializeWebgazer()

    return () => {
      isCleanedUp = true
      isInitialized = false

      // webgazer 정리
      if (window.webgazer && !isCleanedUp) {
        try {
          if (typeof webgazer.setGazeListener === 'function') {
            webgazer.setGazeListener(null)
          }
          // 비디오는 숨기지만 webgazer는 유지
          if (typeof webgazer.showPredictionPoints === 'function') {
            webgazer.showPredictionPoints(false)
          }
        } catch (error) {
          console.error('Webgazer 정리 실패:', error)
        }
      }
    }
  }, [])

  const handlePointClick = useCallback(
    (event: React.MouseEvent, idx: number) => {
      event.preventDefault()
      event.stopPropagation()

      if (idx !== currentIdx || isCalibrated) return
      // console.log('Clicked point', idx)
      const x = (window.innerWidth * points[idx].x) / 100
      const y = (window.innerHeight * points[idx].y) / 100
      if (window.webgazer && window.webgazer.recordScreenPosition) {
        window.webgazer.recordScreenPosition(x, y, 'click')
      }
      setPoints((prev) =>
        prev.map((p, i) => (i === idx ? { ...p, samples: p.samples + 1 } : p)),
      )
    },
    [currentIdx, isCalibrated, points],
  )

  useEffect(() => {
    const curr = points[currentIdx]
    if (!curr) return
    if (curr.samples >= TOTAL_SAMPLES) {
      setTimeout(() => {
        if (currentIdx < points.length - 1) setCurrentIdx(currentIdx + 1)
        else setIsCalibrated(true)
      }, 150)
    }
  }, [points, currentIdx])

  const handleComplete = async () => {
    if (!isCalibrated) return
    try {
      await webgazer.showVideo(true)
      await webgazer.showPredictionPoints(false)
      await webgazer.setGazeListener(() => {})
      setCalibrated()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Webgazer 활성화 실패:', error)
    }
  }

  const getCircleProgress = useCallback((samples: number) => {
    const r = 18
    const c = 2 * Math.PI * r
    const pct = Math.min(samples / TOTAL_SAMPLES, 1)
    return {
      strokeDasharray: c,
      strokeDashoffset: c * (1 - pct),
    }
  }, [])

  useEffect(() => {
    if (isCalibrated && !isTrained) {
      setIsTrained(true)
    }
  }, [isCalibrated, isTrained])

  useEffect(() => {
    let rafId: number
    let lastPrediction: { x: number; y: number } | null = null
    let isActive = true // 컴포넌트 활성 상태 추적

    if (!isTrained) {
      setPrediction(null)
      return
    }

    function loop() {
      if (!isActive) return // 컴포넌트가 언마운트되면 루프 중단

      const pred =
        window.webgazer &&
        window.webgazer.getCurrentPrediction &&
        window.webgazer.getCurrentPrediction()
      if (pred && pred.x && pred.y) {
        setPrediction({ x: pred.x, y: pred.y })
        lastPrediction = { x: pred.x, y: pred.y }
        // provider로 시선 데이터 전달
        updateGazeData(pred.x, pred.y)
      } else if (lastPrediction) {
        setPrediction(lastPrediction)
      }

      if (isActive) {
        rafId = requestAnimationFrame(loop)
      }
    }

    loop()

    return () => {
      isActive = false
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      // 시선 데이터 초기화
      setPrediction(null)
    }
  }, [isTrained, updateGazeData])

  // 컴포넌트 언마운트 시 전체 정리
  useEffect(() => {
    return () => {
      // 모든 상태 초기화
      setPoints(initialPoints)
      setCurrentIdx(0)
      setIsCalibrated(false)
      setCountdown(5)
      setIsTrained(false)
      setPrediction(null)

      // DOM 클래스 정리
      document.documentElement.classList.remove('overflow-hidden', 'h-screen')
      document.body.classList.remove('overflow-hidden', 'h-screen', 'm-0')

      // overlay 참조 초기화
      overlayRef.current = null
    }
  }, [initialPoints])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden m-0 p-0">
      {countdown > 0 ? (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white text-lg text-gray-600 font-normal">
          {countdown}초 후 캘리브레이션이 시작됩니다
        </div>
      ) : (
        <>
          <div className="fixed inset-0 z-[99999] pointer-events-auto">
            {!isCalibrated
              ? points.map((point, idx) => (
                  <div
                    key={point.id}
                    onClick={(e) => handlePointClick(e, idx)}
                    onDoubleClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className={`absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none transition-opacity duration-300 z-[99999]
                      ${
                        idx === currentIdx
                          ? 'cursor-pointer opacity-100 pointer-events-auto animate-pulse'
                          : 'opacity-30 pointer-events-none'
                      }`}
                    style={{
                      left: `${point.x}vw`,
                      top: `${point.y}vh`,
                    }}
                  >
                    <svg width={48} height={48} pointerEvents="none">
                      <circle
                        cx={24}
                        cy={24}
                        r={18}
                        stroke="#bbb"
                        strokeWidth={6}
                        fill="#f4f4f4"
                      />
                      <circle
                        cx={24}
                        cy={24}
                        r={18}
                        stroke="#16a34a"
                        strokeWidth={6}
                        fill="none"
                        style={{
                          transition: 'stroke-dashoffset 0.3s',
                          strokeDasharray: getCircleProgress(point.samples)
                            .strokeDasharray,
                          strokeDashoffset: getCircleProgress(point.samples)
                            .strokeDashoffset,
                          strokeLinecap: 'round',
                        }}
                        transform="rotate(-90 24 24)"
                      />
                      <text
                        x={24}
                        y={29}
                        textAnchor="middle"
                        fontSize={idx === currentIdx ? 17 : 16}
                        fontWeight="bold"
                        fill={idx === currentIdx ? '#16a34a' : '#bbb'}
                      >
                        {point.id}
                      </text>
                    </svg>
                  </div>
                ))
              : prediction &&
                !isTrained && (
                  <div
                    className="absolute w-7 h-7 rounded-full bg-red-500 -translate-x-1/2 -translate-y-1/2 z-[99999] shadow-[0_0_20px_4px_rgba(255,0,0,0.67)]"
                    style={{
                      left: prediction.x,
                      top: prediction.y,
                    }}
                  />
                )}
            {isCalibrated && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] pointer-events-auto">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="w-[180px] h-[48px] bg-green-600 text-white border-none rounded-md text-base font-medium cursor-pointer transition-all duration-200 ease-in-out outline-none select-none active:scale-98 active:bg-green-700"
                >
                  시험 시작
                </button>
              </div>
            )}
          </div>
          <div
            ref={cardRef}
            className="flex flex-col items-center bg-white border rounded-lg shadow-lg fixed inset-0 w-screen h-screen p-8 box-border justify-center z-10"
          >
            <h1 className="mb-4 text-2xl font-bold text-center">
              시선 캘리브레이션
            </h1>
            <p className="mb-8 text-center text-gray-700">
              {isCalibrated
                ? '캘리브레이션이 완료되었습니다! 준비되시면 시험을 시작해주세요.'
                : '각 점을 순서대로 클릭해 초록색 원이 모두 차오를 때까지 진행해주세요.'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
