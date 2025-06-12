import { SubmitCodeResponse, TestCaseResult } from '@/apis/types/submitCode'
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OutputPanelProps {
  output: string
  submissionResult?: SubmitCodeResponse
  isRunning: boolean
}

const TestCaseResultCard = ({ testCase }: { testCase: TestCaseResult }) => {
  const Icon = testCase.passed ? CheckCircle : XCircle
  const iconColor = testCase.passed ? 'text-green-500' : 'text-red-500'
  const borderColor = testCase.passed ? 'border-green-200' : 'border-red-200'
  const bgColor = testCase.passed ? 'bg-green-50' : 'bg-red-50'

  return (
    <div className={`rounded-lg border p-4 ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className="font-semibold">
          테스트 케이스 {testCase.testCaseId}
        </span>
        <Badge variant={testCase.passed ? 'default' : 'destructive'}>
          {testCase.passed ? '통과' : '실패'}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-600">입력:</span>
          <pre className="mt-1 bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
            {testCase.input}
          </pre>
        </div>

        <div>
          <span className="font-medium text-gray-600">예상 출력:</span>
          <pre className="mt-1 bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
            {testCase.expectedOutput}
          </pre>
        </div>

        <div>
          <span className="font-medium text-gray-600">실제 출력:</span>
          <pre
            className={`mt-1 p-2 rounded text-xs font-mono overflow-x-auto ${
              testCase.passed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {testCase.actualOutput}
          </pre>
        </div>

        {testCase.errorMessage && (
          <div>
            <span className="font-medium text-red-600">오류 메시지:</span>
            <pre className="mt-1 bg-red-100 p-2 rounded text-xs font-mono overflow-x-auto text-red-700">
              {testCase.errorMessage}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

const CompilerOutputCard = ({ output }: { output: string }) => (
  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
    <div className="flex items-center gap-2 mb-3">
      <AlertCircle className="w-5 h-5 text-yellow-500" />
      <span className="font-semibold">컴파일러 출력</span>
    </div>
    <pre className="bg-yellow-100 p-3 rounded text-xs font-mono overflow-x-auto text-yellow-800">
      {output}
    </pre>
  </div>
)

const LoadingState = () => (
  <div className="flex items-center justify-center h-32">
    <div className="flex items-center gap-3">
      <Clock className="w-6 h-6 text-blue-500 animate-spin" />
      <span className="text-lg font-medium text-blue-600">
        채점 중입니다...
      </span>
    </div>
  </div>
)

const EmptyState = () => (
  <div className="flex items-center justify-center h-32 text-gray-500">
    <div className="text-center">
      <div className="text-lg font-medium mb-2">
        코드를 실행하면 결과가 여기에 표시됩니다.
      </div>
      <div className="text-sm">실행 버튼을 눌러 코드를 테스트해보세요.</div>
    </div>
  </div>
)

const StatusSummary = ({ result }: { result: SubmitCodeResponse }) => {
  const passedCount = result.results?.filter((tc) => tc.passed).length || 0
  const totalCount = result.results?.length || 0

  const statusColor =
    passedCount === totalCount ? 'text-green-600' : 'text-red-600'
  const StatusIcon = passedCount === totalCount ? CheckCircle : XCircle

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <StatusIcon className={`w-6 h-6 ${statusColor}`} />
        <span className={`text-lg font-semibold ${statusColor}`}>
          채점 완료: {passedCount}/{totalCount} 통과
        </span>
      </div>
      <div className="text-sm text-gray-600">상태: {result.message}</div>
    </div>
  )
}

export const OutputPanel = ({
  output,
  submissionResult,
  isRunning,
}: OutputPanelProps) => {
  if (isRunning) {
    return <LoadingState />
  }

  // 구조화된 결과가 있는 경우
  if (submissionResult) {
    return (
      <div className="space-y-4 pb-4">
        <StatusSummary result={submissionResult} />

        {submissionResult.compilerOutput && (
          <CompilerOutputCard output={submissionResult.compilerOutput} />
        )}

        {submissionResult.results && submissionResult.results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">테스트 케이스 결과</h3>
            {submissionResult.results.map((testCase, index) => (
              <TestCaseResultCard key={index} testCase={testCase} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // 단순 텍스트 출력이 있는 경우
  if (output && output.trim()) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
        <pre className="font-mono text-sm whitespace-pre-wrap overflow-auto">
          {output}
        </pre>
      </div>
    )
  }

  // 빈 상태
  return <EmptyState />
}
