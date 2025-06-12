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

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
}

export const CodePanel = ({ code, output, onCodeChange }: CodePanelProps) => {
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
              </TabsList>

              <TabsContent value="output" className="h-full p-4">
                <pre className="h-full rounded-md bg-muted p-4 font-mono text-sm overflow-auto">
                  {output || '코드를 실행하면 결과가 여기에 표시됩니다.'}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
