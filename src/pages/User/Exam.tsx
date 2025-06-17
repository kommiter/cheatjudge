import { useState, useEffect } from 'react'
import { ExamHeader } from '@/components/domain/exam/ExamHeader.tsx'
import { ProblemNavigation } from '@/components/domain/exam/ProblemNavigation.tsx'
import { ProblemPanel } from '@/components/domain/exam/ProblemPanel.tsx'
import { CodePanel } from '@/components/domain/exam/CodePanel.tsx'
import { useExamData } from '@/hooks/useExamData'
import {
  INITIAL_EXAM_DATA,
  INITIAL_CODE,
  MOCK_TEST_CASES,
} from '@/constants/exam'
import { useSubmitCodeMutation } from '@/queries/submitCode'
import { SubmitCodeDto, SubmitCodeResponse } from '@/apis/types/submitCode'

export default function Exam() {
  // 커스텀 훅
  const { examData, currentProblem, navigateToProblem, goToProblem } =
    useExamData(INITIAL_EXAM_DATA)

  // 로컬 상태
  const [code, setCode] = useState(INITIAL_CODE)
  const [selectedLanguage, setSelectedLanguage] = useState('cpp')
  const [output, setOutput] = useState('')
  const [submissionResult, setSubmissionResult] = useState<
    SubmitCodeResponse | undefined
  >(undefined)
  const [requestIndex, setRequestIndex] = useState(0)

  // React Query Mutation
  const submitCodeMutation = useSubmitCodeMutation({
    onSuccess: (data) => {
      setSubmissionResult(data)
      setOutput('')
    },
    onError: (error) => {
      setSubmissionResult(undefined)
      setOutput(
        `=== 오류 발생 ===\n${error.message || '알 수 없는 오류가 발생했습니다.'}`,
      )
    },
  })

  // 20초마다 코드를 N8N으로 전송
  useEffect(() => {
    const sendCodeToN8N = async () => {
      const n8nUrl = import.meta.env.VITE_N8N_URL
      if (!n8nUrl || !code.trim()) return

      try {
        const payload = {
          index: requestIndex,
          createdAt: new Date().toISOString().replace('T', '-').split('.')[0],
          contents: code,
        }

        await fetch(n8nUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        // 요청 후 index 증가
        setRequestIndex((prev) => prev + 1)
      } catch (error) {
        console.error('N8N으로 코드 전송 실패:', error)
      }
    }

    const interval = setInterval(sendCodeToN8N, 20000)

    return () => clearInterval(interval)
  }, [code, requestIndex])

  // 코드 실행 함수
  const runCode = () => {
    if (!code.trim()) {
      setOutput('코드를 입력해주세요.')
      setSubmissionResult(undefined)
      return
    }

    const testCases = MOCK_TEST_CASES[currentProblem.id] || []
    const submitData: SubmitCodeDto = {
      code,
      testCases,
    }

    setOutput('')
    setSubmissionResult(undefined)
    submitCodeMutation.mutate(submitData)
  }

  return (
    <div className="flex h-screen flex-col">
      <ExamHeader
        problemTitle={currentProblem.title}
        studentName="홍길동"
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onRunCode={runCode}
        currentProblem={currentProblem}
        isRunning={submitCodeMutation.isPending}
      />

      <ProblemNavigation
        examData={examData}
        onNavigate={navigateToProblem}
        onGoToProblem={goToProblem}
      />

      <div className="grid flex-1 grid-cols-2 divide-x border-t">
        <div className="flex flex-col">
          <div className="h-40 bg-gray-100" />
          <ProblemPanel currentProblem={currentProblem} />
        </div>

        <CodePanel
          code={code}
          output={output}
          onCodeChange={setCode}
          isRunning={submitCodeMutation.isPending}
          submissionResult={submissionResult}
        />
      </div>
    </div>
  )
}
