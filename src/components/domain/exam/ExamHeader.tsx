import { Play, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { formatTime } from '@/utils/exam.ts'
import type { Problem } from '@/types/exam.ts'

interface ExamHeaderProps {
  problemTitle: string
  studentName: string
  remainingTime: number
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  onRunCode: () => void
  onSubmit: () => void
  currentProblem: Problem
}

export const ExamHeader = ({
  problemTitle,
  studentName,
  remainingTime,
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  onSubmit,
}: ExamHeaderProps) => {
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
        <Button variant="outline" onClick={onRunCode}>
          <Play className="mr-2 h-4 w-4" />
          실행
        </Button>
        <Button onClick={onSubmit}>제출</Button>
      </div>
    </header>
  )
}
