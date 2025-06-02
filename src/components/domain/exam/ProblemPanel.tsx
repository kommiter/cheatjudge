import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { SubmissionCard } from './SubmissionCard.tsx'
import type { Problem, Submission } from '@/types/exam.ts'

interface ProblemPanelProps {
  currentProblem: Problem
  submissions: Submission[]
}

export const ProblemPanel = ({
  currentProblem,
  submissions,
}: ProblemPanelProps) => {
  return (
    <div className="flex flex-col border-r">
      <Tabs defaultValue="problem" className="flex-1">
        <TabsList className="mx-4 mt-2 justify-start">
          <TabsTrigger value="problem">문제</TabsTrigger>
          <TabsTrigger value="submissions">제출 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="problem" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">{currentProblem.title}</h2>
              <p className="text-sm text-muted-foreground">
                난이도: {currentProblem.difficulty}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">문제 설명</h3>
              <p className="mt-2">
                두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을
                작성하시오.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">입력</h3>
              <p className="mt-2">
                첫째 줄에 A와 B가 주어진다. (0 &lt; A, B &lt; 10)
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">출력</h3>
              <p className="mt-2">첫째 줄에 A+B를 출력한다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">예제 입력 1</h3>
              <pre className="mt-2 rounded-md bg-muted p-4 font-mono">1 2</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold">예제 출력 1</h3>
              <pre className="mt-2 rounded-md bg-muted p-4 font-mono">3</pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">제출 기록</h2>
            <div className="space-y-2">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
