import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // 브라우저 스크롤 완전 차단
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.height = '100vh'
    document.body.style.height = '100vh'
    document.body.style.margin = '0'
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.height = ''
      document.body.style.height = ''
      document.body.style.margin = ''
    }
  }, [])

  // 5,4,3,2,1 카운트다운
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 오버레이 canvas(네모박스) 위치 자동 동기화
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
  })

  // WebGazer 시작
  useEffect(() => {
    let isInitialized = false

    // window.webgazer 할당 (import된 webgazer 객체 사용)
    if (typeof window !== 'undefined' && !window.webgazer) {
      // @ts-expect-error webgazer 타입 정의 부재
      window.webgazer = webgazer
    }

    const initializeWebgazer = async () => {
      try {
        // 해상도 낮추기
        // @ts-expect-error webgazer 타입 정의 부재
        if (window.webgazer) {
          // @ts-expect-error webgazer 타입 정의 부재
          window.webgazer.params.videoWidth = 320
          // @ts-expect-error webgazer 타입 정의 부재
          window.webgazer.params.videoHeight = 240
        }
        // @ts-expect-error webgazer 타입 정의 부재
        await webgazer.setGazeListener(() => {}) // 빈 함수 등록!
        // @ts-expect-error webgazer 타입 정의 부재
        await webgazer.begin()
        isInitialized = true
      } catch (error) {
        console.error('Webgazer 초기화 실패:', error)
      }
    }
    initializeWebgazer()
    return () => {
      if (isInitialized) {
        try {
          // @ts-expect-error webgazer 타입 정의 부재
          webgazer.end()
        } catch (error) {
          console.error('Webgazer 정리 실패:', error)
        }
      }
    }
  }, []) // 의존성 배열 비움

  // 점 클릭
  const handlePointClick = (idx: number) => {
    if (idx !== currentIdx || isCalibrated) return
    console.log('Clicked point', idx)
    const x = (window.innerWidth * points[idx].x) / 100
    const y = (window.innerHeight * points[idx].y) / 100
    // @ts-expect-error webgazer 타입 정의 부재
    if (window.webgazer && window.webgazer.recordScreenPosition) {
      window.webgazer.recordScreenPosition(x, y, 'click')
    }
    setPoints((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, samples: p.samples + 1 } : p)),
    )
  }

  // 점 진행도, 자동 이동
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

  // 완료 버튼
  const handleComplete = () => {
    sessionStorage.setItem('calibrated', 'true')
    navigate('/exam')
  }

  // 원형 프로그레스
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

  // 실시간 예측 (빨간 점)
  useEffect(() => {
    let rafId: number
    let lastPrediction: { x: number; y: number } | null = null
    if (!isTrained) {
      setPrediction(null)
      return
    }
    function loop() {
      // @ts-expect-error webgazer 타입 정의 부재
      const pred =
        window.webgazer &&
        window.webgazer.getCurrentPrediction &&
        window.webgazer.getCurrentPrediction()
      if (pred && pred.x && pred.y) {
        setPrediction({ x: pred.x, y: pred.y })
        lastPrediction = { x: pred.x, y: pred.y }
      } else if (lastPrediction) {
        setPrediction(lastPrediction) // 예측값이 없으면 이전 값 유지
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [isTrained])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background, #f8fafc)',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {countdown > 0 ? (
        <div style={{ fontSize: 22, color: '#888', fontWeight: 400 }}>
          {countdown}초 후 캘리브레이션이 시작됩니다
        </div>
      ) : (
        <>
          {/* 점 오버레이 - pointerEvents: auto, zIndex 최상위 */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              pointerEvents: 'auto',
            }}
          >
            {!isCalibrated
              ? points.map((point, idx) => (
                  <div
                    key={point.id}
                    onClick={() => handlePointClick(idx)}
                    className={
                      'absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none transition-opacity duration-300 ' +
                      (idx === currentIdx
                        ? 'cursor-pointer opacity-100 pointer-events-auto animate-pulse'
                        : 'opacity-30 pointer-events-none')
                    }
                    style={{
                      left: `${point.x}vw`,
                      top: `${point.y}vh`,
                      zIndex: 99999,
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
              : isTrained &&
                prediction && (
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
          </div>
          <div
            ref={cardRef}
            className="flex flex-col items-center bg-card border rounded-lg shadow-lg"
            style={{
              minWidth: 320,
              maxWidth: '95vw',
              minHeight: 300,
              padding: '2rem',
              boxSizing: 'border-box',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 0 20px #eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                marginBottom: 16,
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              시선 캘리브레이션
            </h1>
            <p style={{ marginBottom: 32, textAlign: 'center', color: '#555' }}>
              {isCalibrated
                ? '캘리브레이션이 완료되었습니다! 준비되시면 시험을 시작해주세요.'
                : '각 점을 순서대로 클릭해 초록색 원이 모두 차오를 때까지 진행해주세요.'}
            </p>
            <button
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50 mt-auto"
              onClick={handleComplete}
              disabled={!isCalibrated}
              style={{
                width: 180,
                marginTop: 10,
                background: undefined,
                color: undefined,
                cursor: isCalibrated ? 'pointer' : 'not-allowed',
              }}
            >
              시험 시작
            </button>
          </div>
        </>
      )}
    </div>
  )
}
