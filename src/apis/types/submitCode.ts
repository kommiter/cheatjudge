// 테스트 케이스 타입
export interface TestCase {
  input: string
  expectedOutput: string
}

// 코드 제출 요청 타입
export interface SubmitCodeDto {
  code: string
  testCases: TestCase[]
}

// 채점 상태 타입
export type SubmissionStatus =
  | 'SUCCESS'
  | 'COMPILE_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIMEOUT'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'

// 테스트 케이스 결과 타입
export interface TestCaseResult {
  testCaseId: number
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  errorMessage: string | null
}

// 코드 제출 응답 타입
export interface SubmitCodeResponse {
  status: SubmissionStatus
  message: string
  compilerOutput: string | null
  results: TestCaseResult[] | null
}
