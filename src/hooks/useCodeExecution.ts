import { useState } from 'react'

export const useCodeExecution = () => {
  const [output, setOutput] = useState('')

  const runCode = () => {
    setOutput('실행 중...\n\n입력: 1 2\n출력: 3\n\n실행 완료 (0.001초)')
  }

  return {
    output,
    runCode,
  }
}
