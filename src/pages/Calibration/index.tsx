import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import webgazer from 'webgazer'

interface CalibrationPoint {
  id: number
  x: number
  y: number
  samples: number
}

const TOTAL_SAMPLES = 3
const CARD_HORIZONTAL_PADDING = 32

export default function Calibration() {
  const navigate = useNavigate()
  const [points, setPoints] = useState<CalibrationPoint[]>([
    { id: 1, x: 5, y: 5, samples: 0 },
    { id: 2, x: 50, y: 5, samples: 0 },
    { id: 3, x: 95, y: 5, samples: 0 },
    { id: 4, x: 5, y: 50, samples: 0 },
    { id: 5, x: 50, y: 50, samples: 0 },
    { id: 6, x: 95, y: 50, samples: 0 },
    { id: 7, x: 5, y: 95, samples: 0 },
    { id: 8, x: 50, y: 95, samples: 0 },
    { id: 9, x: 95, y: 95, samples: 0 },
  ])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isTrained, setIsTrained] = useState(false)
  const [prediction, setPrediction] = useState<{ x: number; y: number } | null>(
    null,
  )

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

  useEffect(() => {
    function updateOverlayPosition() {
      const card = cardRef.current
      const overlay = document.querySelector(
        '.webgazerFaceOverlay',
      ) as HTMLElement
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
    }
    const handleUpdate = () => setTimeout(updateOverlayPosition, 100)
    handleUpdate()
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate)
    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate)
    }
  }, [])

  useEffect(() => {
    // window.webgazer 할당 (import된 webgazer 객체 사용)
    if (typeof window !== 'undefined' && !window.webgazer) {
      window.webgazer = webgazer
    }

    const initializeWebgazer = async () => {
      try {
        await webgazer.begin()
        await webgazer.setGazeListener(() => {})
        await webgazer.setRegression('ridge')
        await webgazer.setTracker('TFFacemesh')
        await webgazer.showVideo(true)
        await webgazer.showPredictionPoints(true)
      } catch (error) {
        console.error('Webgazer 초기화 실패:', error)
      }
    }

    initializeWebgazer()
    return () => {
      // 페이지를 떠날 때 webgazer를 종료할지 여부는 애플리케이션의 디자인에 따라 다릅니다.
      // 예를 들어, 다른 페이지로 이동해도 계속 트래킹하고 싶다면 종료하지 않을 수 있습니다.
      // 지금은 종료하지 않도록 유지합니다.
      // webgazer.end()
    }
  }, [])

  const handlePointClick = (idx: number) => {
    if (idx !== currentIdx || isCalibrated) return
    console.log('Clicked point', idx)
    const x = (window.innerWidth * points[idx].x) / 100
    const y = (window.innerHeight * points[idx].y) / 100
    if (window.webgazer && window.webgazer.recordScreenPosition) {
      window.webgazer.recordScreenPosition(x, y, 'click')
    }
    setPoints((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, samples: p.samples + 1 } : p)),
    )
  }

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
      navigate('/exam')
    } catch (error) {
      console.error('Webgazer 활성화 실패:', error)
    }
  }

  const getCircleProgress = (samples: number) => {
    const r = 18
    const c = 2 * Math.PI * r
    const pct = Math.min(samples / TOTAL_SAMPLES, 1)
    return {
      strokeDasharray: c,
      strokeDashoffset: c * (1 - pct),
    }
  }

  useEffect(() => {
    if (isCalibrated && !isTrained) {
      setIsTrained(true)
    }
  }, [isCalibrated, isTrained])

  useEffect(() => {
    let rafId: number
    let lastPrediction: { x: number; y: number } | null = null
    if (!isTrained) {
      setPrediction(null)
      return
    }

    function loop() {
      const pred =
        window.webgazer &&
        window.webgazer.getCurrentPrediction &&
        window.webgazer.getCurrentPrediction()
      if (pred && pred.x && pred.y) {
        setPrediction({ x: pred.x, y: pred.y })
        lastPrediction = { x: pred.x, y: pred.y }
      } else if (lastPrediction) {
        setPrediction(lastPrediction)
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [isTrained])

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
                    onClick={() => handlePointClick(idx)}
                    className={`absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none transition-opacity duration-300 
                      ${
                        idx === currentIdx
                          ? 'cursor-pointer opacity-100 pointer-events-auto animate-pulse'
                          : 'opacity-30 pointer-events-none'
                      }`}
                    style={{
                      left: `${point.x}vw`,
                      top: `${point.y}vh`,
                      zIndex: 99999, // 이 zIndex는 fixed inset-0 div의 zIndex보다 높아야 합니다.
                      pointerEvents: idx === currentIdx ? 'auto' : 'none',
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
                    className="absolute rounded-full bg-red-500"
                    style={{
                      width: 28,
                      height: 28,
                      left: prediction.x,
                      top: prediction.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 99999,
                      boxShadow: '0 0 20px 4px #ff0000aa',
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
