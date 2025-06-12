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
import { OutputPanel } from './OutputPanel.tsx'
import { SubmitCodeResponse } from '@/apis/types/submitCode'

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
  isRunning?: boolean
  submissionResult?: SubmitCodeResponse
}

export const CodePanel = ({
  code,
  output,
  onCodeChange,
  isRunning = false,
  submissionResult,
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
          <div className="h-full flex flex-col">
            <Tabs defaultValue="output" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-2 justify-start shrink-0">
                <TabsTrigger value="output">실행 결과</TabsTrigger>
              </TabsList>

              <TabsContent
                value="output"
                className="flex-1 p-4 pt-2 overflow-hidden"
              >
                <div className="h-full overflow-y-auto">
                  <OutputPanel
                    output={output}
                    submissionResult={submissionResult}
                    isRunning={isRunning}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
