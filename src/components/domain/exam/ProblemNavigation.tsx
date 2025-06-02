import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import type { ExamData, NavigationDirection } from '@/types/exam.ts'

interface ProblemNavigationProps {
  examData: ExamData
  onNavigate: (direction: NavigationDirection) => void
  onGoToProblem: (problemIndex: number) => void
}

export const ProblemNavigation = ({
  examData,
  onNavigate,
  onGoToProblem,
}: ProblemNavigationProps) => {
  return (
    <div className="border-b bg-muted/30 px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('prev')}
                disabled={examData.currentProblem === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>이전 문제</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center justify-center gap-2">
          {examData.problems.map((problem) => (
            <TooltipProvider key={problem.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      examData.currentProblem === problem.id
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    className={`h-10 w-10 ${
                      problem.completed
                        ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                        : examData.currentProblem === problem.id
                          ? ''
                          : 'hover:border-primary'
                    }`}
                    onClick={() => onGoToProblem(problem.id)}
                  >
                    {problem.id}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-xs text-muted-foreground">
                      난이도: {problem.difficulty}
                    </div>
                    <div className="mt-1 text-xs">
                      {problem.completed ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          완료됨
                        </span>
                      ) : (
                        <span>미완료</span>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('next')}
                disabled={examData.currentProblem === examData.totalProblems}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>다음 문제</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
