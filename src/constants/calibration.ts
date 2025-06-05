import type { CalibrationPoint } from '@/types/webgazer'

// 캘리브레이션 포인트 위치 클래스 정의
export const POINT_POSITION_CLASSES = {
  1: 'left-[5%] top-[5%]',
  2: 'left-[50%] top-[5%]',
  3: 'left-[95%] top-[5%]',
  4: 'left-[5%] top-[50%]',
  5: 'left-[50%] top-[50%]',
  6: 'left-[95%] top-[50%]',
  7: 'left-[5%] top-[95%]',
  8: 'left-[50%] top-[95%]',
  9: 'left-[95%] top-[95%]',
} as const

// 캘리브레이션 포인트 정의 (화면의 9개 지점)
export const CALIBRATION_POINTS: CalibrationPoint[] = [
  { id: 1, x: 5, y: 5 },
  { id: 2, x: 50, y: 5 },
  { id: 3, x: 95, y: 5 },
  { id: 4, x: 5, y: 50 },
  { id: 5, x: 50, y: 50 },
  { id: 6, x: 95, y: 50 },
  { id: 7, x: 5, y: 95 },
  { id: 8, x: 50, y: 95 },
  { id: 9, x: 95, y: 95 },
]

// 캘리브레이션 완료 후 홈으로 이동하는 지연 시간 (ms)
export const CALIBRATION_COMPLETE_DELAY = 3000
