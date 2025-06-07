export interface TestResult {
  id: number
  status: 'success' | 'error' | 'pending'
  input: string
  expectedOutput: string
  actualOutput: string
  time: string
}

export interface Problem {
  id: number
  title: string
  difficulty: string
  completed: boolean
}

export interface ExamData {
  totalProblems: number
  currentProblem: number
  problems: Problem[]
}

export type NavigationDirection = 'prev' | 'next'
export type ProgrammingLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript'
