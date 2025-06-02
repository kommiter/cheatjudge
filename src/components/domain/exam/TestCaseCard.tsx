import { CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.tsx'
import type { TestResult } from '@/types/exam.ts'

interface TestCaseCardProps {
  testResult: TestResult
}

export const TestCaseCard = ({ testResult }: TestCaseCardProps) => {
  const getStatusElement = () => {
    switch (testResult.status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="h-4 w-4" />
            통과
          </span>
        )
      case 'error':
        return (
          <span className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            실패
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            대기 중
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">테스트 케이스 #{testResult.id}</h3>
          <div className="flex items-center gap-1">
            {getStatusElement()}
            {testResult.time && (
              <span className="text-sm text-muted-foreground">
                {testResult.time}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">입력:</p>
            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
              {testResult.input}
            </pre>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">예상 출력:</p>
            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
              {testResult.expectedOutput}
            </pre>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">실제 출력:</p>
            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
              {testResult.actualOutput || '없음'}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
