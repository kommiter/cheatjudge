import { useState } from 'react'
import { ExamData, NavigationDirection } from '@/types/exam'

export const useExamData = (initialData: ExamData) => {
  const [examData, setExamData] = useState(initialData)

  const currentProblem = examData.problems[examData.currentProblem - 1]

  const navigateToProblem = (direction: NavigationDirection) => {
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

  return {
    examData,
    currentProblem,
    navigateToProblem,
    goToProblem,
    toggleProblemCompletion,
  }
}
