import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { CodeEditor } from '@/components/common/CodeEditor.tsx'
import { TestCaseCard } from './TestCaseCard.tsx'
import type { TestResult } from '@/types/exam.ts'

interface CodePanelProps {
  code: string
  output: string
  testResults: TestResult[]
  onCodeChange: (code: string) => void
}

export const CodePanel = ({
  code,
  output,
  testResults,
  onCodeChange,
}: CodePanelProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 border-b bg-muted p-4 rounded-lg">
        <CodeEditor initialCode={code} onChange={onCodeChange} />
      </div>

      <div className="flex-1">
        <Tabs defaultValue="output">
          <TabsList className="mx-4 mt-2 justify-start">
            <TabsTrigger value="output">실행 결과</TabsTrigger>
            <TabsTrigger value="testcases">테스트 케이스</TabsTrigger>
          </TabsList>

          <TabsContent value="output" className="p-4">
            <pre className="h-full rounded-md bg-muted p-4 font-mono text-sm">
              {output || '코드를 실행하면 결과가 여기에 표시됩니다.'}
            </pre>
          </TabsContent>

          <TabsContent value="testcases" className="p-4">
            <div className="space-y-2">
              {testResults.map((test) => (
                <TestCaseCard key={test.id} testResult={test} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
