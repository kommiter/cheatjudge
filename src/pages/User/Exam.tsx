import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { CodeEditor } from '@/components/common/CodeEditor.tsx'
import webgazer from 'webgazer'

interface TestResult {
  id: number
  status: 'success' | 'error' | 'pending'
  input: string
  expectedOutput: string
  actualOutput: string
  time: string
}
export default function Student() {
  const [output, setOutput] = useState('')
  const [testResults] = useState<TestResult[]>([
    {
      id: 1,
      status: 'success',
      input: '1 2',
      expectedOutput: '3',
      actualOutput: '3',
      time: '0.001s',
    },
    {
      id: 2,
      status: 'error',
      input: '5 7',
      expectedOutput: '12',
      actualOutput: '13',
      time: '0.001s',
    },
    {
      id: 3,
      status: 'pending',
      input: '10 20',
      expectedOutput: '30',
      actualOutput: '',
      time: '',
    },
  ])

  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`)

  const [examData, setExamData] = useState({
    totalProblems: 5,
    currentProblem: 1,
    problems: [
      { id: 1, title: '두 수의 합', difficulty: '쉬움', completed: true },
      { id: 2, title: '배열 정렬', difficulty: '중간', completed: false },
      { id: 3, title: '이진 탐색', difficulty: '중간', completed: false },
      { id: 4, title: '링크드 리스트', difficulty: '어려움', completed: false },
      {
        id: 5,
        title: '동적 프로그래밍',
        difficulty: '어려움',
        completed: false,
      },
    ],
  })

  const initialTime = 30 * 60 // 30분을 초 단위로
  const [remainingTime, setRemainingTime] = useState(initialTime)

  const navigate = useNavigate()

  useEffect(() => {
    // 캘리브레이션 체크
    if (sessionStorage.getItem('calibrated') !== 'true') {
      navigate('/calibration')
      return
    }

    let isInitialized = false

    const initializeWebgazer = async () => {
      try {
        // webgazer 초기화
        webgazer.setGazeListener((data: { x: number; y: number } | null) => {
          if (data == null) return

          const { x, y } = data
          const windowWidth = window.innerWidth
          const windowHeight = window.innerHeight

          // 화면 밖을 바라보는지 체크
          if (x < 0 || x > windowWidth || y < 0 || y > windowHeight) {
            alert('화면 밖을 바라보고 있습니다. 시험에 집중해주세요.')
          }
        })

        // webgazer 시작
        webgazer.begin()
        webgazer.showPredictionPoints(true)
        isInitialized = true
      } catch (error) {
        console.error('Webgazer 초기화 실패:', error)
      }
    }

    initializeWebgazer()

    return () => {
      if (isInitialized) {
        try {
          webgazer.end()
        } catch (error) {
          console.error('Webgazer 정리 실패:', error)
        }
      }
    }
  }, [navigate])

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          // 시간이 다 되면 실행할 로직 (예: 시험 자동 제출)
          console.log('시간 종료!')
          clearInterval(timerId)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timerId) // 컴포넌트 언마운트 시 타이머 정리
  }, []) // 빈 의존성 배열로 한 번만 실행

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const currentProblem = examData.problems[examData.currentProblem - 1]

  const runCode = () => {
    setOutput('실행 중...\n\n입력: 1 2\n출력: 3\n\n실행 완료 (0.001초)')
  }

  const navigateToProblem = (direction: 'prev' | 'next') => {
    setExamData((prev) => {
      const newProblemIndex =
        direction === 'next'
          ? Math.min(prev.currentProblem + 1, prev.totalProblems)
          : Math.max(prev.currentProblem - 1, 1)

      return {
        ...prev,
        currentProblem: newProblemIndex,
      }
    })
  }

  const goToProblem = (problemIndex: number) => {
    setExamData((prev) => ({
      ...prev,
      currentProblem: problemIndex,
    }))
  }

  const toggleProblemCompletion = (problemId: number) => {
    setExamData((prev) => ({
      ...prev,
      problems: prev.problems.map((p) =>
        p.id === problemId ? { ...p, completed: !p.completed } : p,
      ),
    }))
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{'문제제목'}</h1>
          <div className="rounded-full bg-muted px-3 py-1 text-sm">
            학생 이름
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>남은 시간: {formatTime(remainingTime)}</span>
          </div>
          <Select defaultValue="cpp">
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
          <Button variant="outline" onClick={runCode}>
            <Play className="mr-2 h-4 w-4" />
            실행
          </Button>
          <Button onClick={() => toggleProblemCompletion(currentProblem.id)}>
            제출
          </Button>
        </div>
      </header>

      {/* Problem Navigation Bar */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateToProblem('prev')}
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
                      onClick={() => goToProblem(problem.id)}
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
                  onClick={() => navigateToProblem('next')}
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

      {/* Rest of the component remains the same as in the original */}
      <div className="grid flex-1 grid-cols-2">
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
                  <pre className="mt-2 rounded-md bg-muted p-4 font-mono">
                    1 2
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">예제 출력 1</h3>
                  <pre className="mt-2 rounded-md bg-muted p-4 font-mono">
                    3
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="submissions"
              className="flex-1 overflow-auto p-4"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-bold">제출 기록</h2>

                <div className="space-y-2">
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">제출 #3</p>
                        <p className="text-sm text-muted-foreground">
                          2025-03-19 14:32:45
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          C++
                        </span>
                        <span className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          오답
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">제출 #2</p>
                        <p className="text-sm text-muted-foreground">
                          2025-03-19 14:30:12
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          C++
                        </span>
                        <span className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          컴파일 에러
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">제출 #1</p>
                        <p className="text-sm text-muted-foreground">
                          2025-03-19 14:25:33
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          C++
                        </span>
                        <span className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          오답
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 border-b bg-muted p-4 rounded-lg">
            <CodeEditor initialCode={code} onChange={setCode} />
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
                    <Card key={test.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">
                            테스트 케이스 #{test.id}
                          </h3>
                          <div className="flex items-center gap-1">
                            {test.status === 'success' && (
                              <span className="flex items-center gap-1 text-sm text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                통과
                              </span>
                            )}
                            {test.status === 'error' && (
                              <span className="flex items-center gap-1 text-sm text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                실패
                              </span>
                            )}
                            {test.status === 'pending' && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                대기 중
                              </span>
                            )}
                            {test.time && (
                              <span className="text-sm text-muted-foreground">
                                {test.time}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              입력:
                            </p>
                            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
                              {test.input}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              예상 출력:
                            </p>
                            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
                              {test.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              실제 출력:
                            </p>
                            <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
                              {test.actualOutput || '없음'}
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
