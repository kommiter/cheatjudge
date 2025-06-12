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
export type ProgrammingLanguage = 'cpp'
