import { useState, useEffect } from 'react'
import { ExamHeader } from '@/components/domain/exam/ExamHeader.tsx'
import { ProblemNavigation } from '@/components/domain/exam/ProblemNavigation.tsx'
import { ProblemPanel } from '@/components/domain/exam/ProblemPanel.tsx'
import { CodePanel } from '@/components/domain/exam/CodePanel.tsx'
import { useExamData } from '@/hooks/useExamData'
import { useCodeExecution } from '@/hooks/useCodeExecution'
import {
  INITIAL_EXAM_DATA,
  INITIAL_CODE,
  MOCK_TEST_RESULTS,
  MOCK_SUBMISSIONS,
} from '@/constants/exam'

export default function Exam() {
  // 커스텀 훅
  const {
    examData,
    currentProblem,
    navigateToProblem,
    goToProblem,
    toggleProblemCompletion,
  } = useExamData(INITIAL_EXAM_DATA)
  const { output, runCode } = useCodeExecution()

  // 로컬 상태
  const [code, setCode] = useState(INITIAL_CODE)
  const [selectedLanguage, setSelectedLanguage] = useState('cpp')
  const [testResults] = useState(MOCK_TEST_RESULTS)

  // 핸들러
  const handleSubmit = () => {
    toggleProblemCompletion(currentProblem.id)
  }

  // WebGazer 설정을 위한 useEffect 추가
  useEffect(() => {
    // Exam 페이지 진입 시 비디오가 보이도록 설정
    if (window.webgazer) {
      try {
        if (typeof window.webgazer.showVideo === 'function') {
          window.webgazer.showVideo(true)
        }
        if (typeof window.webgazer.showPredictionPoints === 'function') {
          window.webgazer.showPredictionPoints(false)
        }
      } catch (error) {
        console.warn('WebGazer 설정 실패:', error)
      }
    }

    return () => {
      // 컴포넌트 언마운트 시에는 비디오만 숨기고 webgazer는 유지
      if (window.webgazer) {
        try {
          if (typeof window.webgazer.showVideo === 'function') {
            window.webgazer.showVideo(false)
          }
        } catch (error) {
          console.warn('WebGazer cleanup error in Exam:', error)
        }
      }
    }
  }, [])

  // WebGazer 정리를 위한 useEffect 추가
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 WebGazer 일시정지
      if (window.webgazer) {
        try {
          window.webgazer.pause()
        } catch (error) {
          console.warn('WebGazer pause error in Exam:', error)
        }
      }
    }
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <ExamHeader
        problemTitle={currentProblem.title}
        studentName="홍길동"
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onRunCode={runCode}
        onSubmit={handleSubmit}
        currentProblem={currentProblem}
      />

      <ProblemNavigation
        examData={examData}
        onNavigate={navigateToProblem}
        onGoToProblem={goToProblem}
      />

      <div className="grid flex-1 grid-cols-2">
        <ProblemPanel
          currentProblem={currentProblem}
          submissions={MOCK_SUBMISSIONS}
        />

        <CodePanel
          code={code}
          output={output}
          testResults={testResults}
          onCodeChange={setCode}
        />
      </div>
    </div>
  )
}
