import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable.tsx'
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
    <div className="h-full">
      <ResizablePanelGroup direction="vertical" className="h-full">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full border-b bg-muted p-4">
            <CodeEditor initialCode={code} onChange={onCodeChange} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="h-full">
            <Tabs defaultValue="output" className="h-full">
              <TabsList className="mx-4 mt-2 justify-start">
                <TabsTrigger value="output">실행 결과</TabsTrigger>
                <TabsTrigger value="testcases">테스트 케이스</TabsTrigger>
              </TabsList>

              <TabsContent value="output" className="h-full p-4">
                <pre className="h-full rounded-md bg-muted p-4 font-mono text-sm overflow-auto">
                  {output || '코드를 실행하면 결과가 여기에 표시됩니다.'}
                </pre>
              </TabsContent>

              <TabsContent value="testcases" className="h-full p-4">
                <div className="space-y-2 h-full overflow-auto">
                  {testResults.map((test) => (
                    <TestCaseCard key={test.id} testResult={test} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
