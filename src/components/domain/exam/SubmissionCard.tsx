import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.tsx'
import type { Submission } from '@/types/exam.ts'

interface SubmissionCardProps {
  submission: Submission
}

export const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const getStatusInfo = () => {
    switch (submission.status) {
      case 'correct':
        return { text: '정답', color: 'text-green-500' }
      case 'wrong':
        return { text: '오답', color: 'text-red-500' }
      case 'compile_error':
        return { text: '컴파일 에러', color: 'text-red-500' }
      case 'runtime_error':
        return { text: '런타임 에러', color: 'text-red-500' }
      case 'time_limit':
        return { text: '시간 초과', color: 'text-orange-500' }
      default:
        return { text: '알 수 없음', color: 'text-gray-500' }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">제출 #{submission.id}</p>
          <p className="text-sm text-muted-foreground">
            {submission.submittedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {submission.language}
          </span>
          <span
            className={`flex items-center gap-1 text-sm ${statusInfo.color}`}
          >
            <AlertCircle className="h-4 w-4" />
            {statusInfo.text}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
