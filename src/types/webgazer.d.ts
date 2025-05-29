declare module 'webgazer'

interface WebGazer {
  setGazeListener: (
    listener: (data: { x: number; y: number } | null) => void,
  ) => WebGazer
  begin: () => Promise<void>
  end: () => void
  showPredictionPoints: (show: boolean) => void
  recordScreenPosition: (x: number, y: number, type: string) => void
  params: { videoWidth: number; videoHeight: number }
  train: () => Promise<void>
  getCurrentPrediction: () => { x: number; y: number } | null
  setRegression: (regression: string) => void
  setSmoothing: (smoothing: boolean) => void
  dataCollector: { data: unknown[] }
}

interface Window {
  webgazer: WebGazer // 정의된 인터페이스 사용
}
