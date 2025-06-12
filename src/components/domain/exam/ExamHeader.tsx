import { Play, Clock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { formatTime } from '@/utils/exam.ts'
import { useExamTimer } from '@/hooks/useExamTimer'
import { useCalibration } from '@/contexts/CalibrationProvider'
import { INITIAL_EXAM_TIME } from '@/constants/exam'
import type { Problem } from '@/types/exam.ts'

interface ExamHeaderProps {
  problemTitle: string
  studentName: string
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  onRunCode: () => void
  currentProblem: Problem
}

export const ExamHeader = ({
  problemTitle,
  studentName,
  selectedLanguage,
  onLanguageChange,
  onRunCode,
}: ExamHeaderProps) => {
  const { remainingTime } = useExamTimer(INITIAL_EXAM_TIME)
  const { isPredictionPointsVisible, togglePredictionPoints } = useCalibration()

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{problemTitle}</h1>
        <div className="rounded-full bg-muted px-3 py-1 text-sm">
          {studentName}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>남은 시간: {formatTime(remainingTime)}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={togglePredictionPoints}
          title={
            isPredictionPointsVisible
              ? '시선 포인터 숨기기'
              : '시선 포인터 보이기'
          }
        >
          {isPredictionPointsVisible ? (
            <Eye className="h-4 w-4 text-red-500" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="언어 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" onClick={onRunCode}>
          <Play className="mr-2 h-4 w-4" />
          실행
        </Button>
      </div>
    </header>
  )
}
