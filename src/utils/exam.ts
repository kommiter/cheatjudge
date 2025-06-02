/**
 * 초를 HH:MM:SS 형식으로 변환합니다.
 */
export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * 제출 상태에 따른 아이콘과 텍스트를 반환합니다.
 */
export const getSubmissionStatusInfo = (status: string) => {
  switch (status) {
    case 'correct':
      return { text: '정답', color: 'text-green-500' }
    case 'wrong':
      return { text: '오답', color: 'text-red-500' }
    case 'compile_error':
      return { text: '컴파일 에러', color: 'text-red-500' }
    default:
      return { text: '알 수 없음', color: 'text-gray-500' }
  }
}
