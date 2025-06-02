import { useState } from 'react'
import { ExamHeader } from '@/components/domain/exam/ExamHeader.tsx'
import { ProblemNavigation } from '@/components/domain/exam/ProblemNavigation.tsx'
import { ProblemPanel } from '@/components/domain/exam/ProblemPanel.tsx'
import { CodePanel } from '@/components/domain/exam/CodePanel.tsx'
import { useExamTimer } from '@/hooks/useExamTimer'
import { useExamData } from '@/hooks/useExamData'
import { useCodeExecution } from '@/hooks/useCodeExecution'
import {
  INITIAL_EXAM_DATA,
  INITIAL_CODE,
  MOCK_TEST_RESULTS,
  MOCK_SUBMISSIONS,
  INITIAL_EXAM_TIME,
} from '@/constants/exam'

export default function Exam() {
  // 커스텀 훅
  const { remainingTime } = useExamTimer(INITIAL_EXAM_TIME)
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

  return (
    <div className="flex h-screen flex-col">
      <ExamHeader
        problemTitle={currentProblem.title}
        studentName="학생 이름"
        remainingTime={remainingTime}
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
