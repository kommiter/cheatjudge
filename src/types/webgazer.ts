/**
 * WebGazer.js 타입 정의
 * WebGazer.js는 웹캠을 사용한 실시간 시선 추적 라이브러리입니다.
 */

export interface WebGazerData {
  /** 시선의 X 좌표 (픽셀 단위) */
  x: number
  /** 시선의 Y 좌표 (픽셀 단위) */
  y: number
}

export interface WebGazer {
  /**
   * 회귀 모델 설정
   * @param type 'ridge', 'weightedRidge', 'threadedRidge' 등
   */
  setRegression: (type: string) => WebGazer

  /**
   * 얼굴 추적 모델 설정
   * @param type 'TFFacemesh', 'clmtrackr' 등
   */
  setTracker: (type: string) => WebGazer

  /**
   * 시선 데이터 리스너 설정
   * @param callback 시선 데이터를 받을 콜백 함수
   */
  setGazeListener: (
    callback: (data: WebGazerData | null, elapsedTime: number) => void,
  ) => WebGazer

  /**
   * WebGazer 시작
   */
  begin: () => Promise<void>

  /**
   * WebGazer 종료
   */
  end: () => void

  /**
   * 웹캠 비디오 요소 가져오기
   */
  getVideoElement: () => HTMLVideoElement | null

  /**
   * 캘리브레이션 포인트 추가
   * @param x X 좌표
   * @param y Y 좌표
   * @param active 활성 상태
   */
  watchListener: (x: number, y: number, active: boolean) => void

  /**
   * 캘리브레이션 데이터 초기화
   */
  clearData: () => void

  /**
   * 현재 시선 위치 예측
   */
  getCurrentPrediction: () => WebGazerData | null

  /**
   * 비디오 요소 표시/숨김
   * @param show 표시 여부
   */
  showVideo: (show: boolean) => WebGazer

  /**
   * 예측 포인트 표시/숨김
   * @param show 표시 여부
   */
  showPredictionPoints: (show: boolean) => WebGazer

  /**
   * 얼굴 오버레이 표시/숨김
   * @param show 표시 여부
   */
  showFaceOverlay: (show: boolean) => WebGazer

  /**
   * 얼굴 피드백 박스 표시/숨김
   * @param show 표시 여부
   */
  showFaceFeedbackBox: (show: boolean) => WebGazer
}

declare global {
  interface Window {
    webgazer: WebGazer
  }
}

export interface CalibrationPoint {
  /** 포인트 고유 ID */
  id: number
  /** X 좌표 (퍼센트) */
  x: number
  /** Y 좌표 (퍼센트) */
  y: number
}

export interface CalibrationState {
  /** WebGazer 로드 상태 */
  isWebgazerLoaded: boolean
  /** 캘리브레이션 진행 상태 */
  isCalibrating: boolean
  /** 현재 포인트 인덱스 */
  currentPointIndex: number
  /** 캘리브레이션 완료 상태 */
  isCompleted: boolean
  /** 현재 상태 메시지 */
  status: string
}
