export enum ErrorCode {
  SUCCESS = 'SUCCESS',
  COMPILE_ERROR = 'COMPILE_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIMEOUT = 'TIMEOUT',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

type ErrorMessages = {
  [key in ErrorCode]: string
}

// 에러 코드와 안내 문자열을 매핑하는 객체
const errorMessages: ErrorMessages = {
  [ErrorCode.SUCCESS]: '성공',
  [ErrorCode.COMPILE_ERROR]: '컴파일 에러: 코드를 확인해 주세요.',
  [ErrorCode.RUNTIME_ERROR]:
    '런타임 에러: 프로그램 실행 중 오류가 발생했습니다.',
  [ErrorCode.TIMEOUT]: '시간 초과: 프로그램 실행 시간이 너무 깁니다.',
  [ErrorCode.MEMORY_LIMIT_EXCEEDED]:
    '메모리 제한 초과: 할당된 메모리를 초과했습니다.',
  [ErrorCode.INTERNAL_ERROR]:
    '내부 에러: 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
}

/**
 * 에러 코드를 통해 해당 안내 문자열을 반환하는 함수
 * @param errorCode 가져올 에러 코드 (ErrorCode enum 값)
 * @returns 해당 에러 코드에 대한 안내 문자열. 매칭되는 코드가 없으면 기본 메시지를 반환합니다.
 */
export function getErrorMessage(errorCode: ErrorCode): string {
  return errorMessages[errorCode] || '알 수 없는 에러가 발생했습니다.'
}
